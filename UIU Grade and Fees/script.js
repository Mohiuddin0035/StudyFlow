// === THEME SWITCH LOGIC ===
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

// Check for saved theme preference on load
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Event listener for theme switch
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme);


// === NAVIGATION LOGIC ===
function showSection(id) {
    document.querySelectorAll('.tool-section, #menu').forEach(el => el.style.display = 'none');
    
    if (id === 'menu') {
        document.getElementById('menu').style.display = 'grid';
    } else {
        document.getElementById(id).style.display = 'block';
    }
    document.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
}

// === CGPA LOGIC ===
window.onload = function() {
    // Re-check theme on load just in case
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') toggleSwitch.checked = true;
    }
    
    addCourse(); addCourse(); addCourse();
};

function addCourse() {
    const div = document.createElement('div');
    div.className = 'course-row';
    div.innerHTML = `
        <input type="text" placeholder="Subject Name" class="c-name">
        <input type="number" placeholder="Cr" class="c-credit">
        <input type="number" placeholder="GPA" class="c-gpa">
    `;
    document.getElementById('course-list').appendChild(div);
}

function calculateCGPA() {
    const prevCgpa = parseFloat(document.getElementById('prev-cgpa').value) || 0;
    const prevCredit = parseFloat(document.getElementById('prev-credit').value) || 0;

    let currCredit = 0;
    let currPoints = 0;
    let courseDetails = "";

    const rows = document.querySelectorAll('.course-row');
    
    rows.forEach((row, index) => {
        const name = row.querySelector('.c-name').value || `Course ${index + 1}`;
        const credit = parseFloat(row.querySelector('.c-credit').value);
        const gpa = parseFloat(row.querySelector('.c-gpa').value);

        if (!isNaN(credit) && !isNaN(gpa)) {
            currCredit += credit;
            currPoints += (credit * gpa);
            courseDetails += `• ${name}: ${gpa} (Cr: ${credit})\n`;
        }
    });

    if (currCredit === 0 && prevCredit === 0) {
        alert("Please enter course details or previous results!");
        return;
    }

    const currGPA = currCredit > 0 ? (currPoints / currCredit) : 0;
    const totalCredit = prevCredit + currCredit;
    const totalCGPA = ((prevCgpa * prevCredit) + currPoints) / totalCredit;

    let msg = "";
    if (totalCGPA >= 3.50) {
        msg = "\n🎉 Congratulations! Waiver Eligible next trimester!";
    } else if (totalCGPA > prevCgpa) {
        msg = "\n👏 Great job! You improved your CGPA. Keep going!";
    } else {
        msg = "\n💪 Don't give up! Trust in Allah and try harder next time.";
    }

    const resultBox = document.getElementById('cgpa-result');
    resultBox.style.display = 'block';
    resultBox.innerText = 
`=== RESULT SUMMARY ===

CURRENT TRIMESTER:
${courseDetails}--------------------------
Current GPA  : ${currGPA.toFixed(2)}
Current Credit: ${currCredit}

OVERALL STATUS:
--------------------------
Previous CGPA: ${prevCgpa.toFixed(2)}
Total Credit : ${totalCredit}
Updated CGPA : ${totalCGPA.toFixed(2)}

${msg}`;
}

// === PAYMENT LOGIC (FIXED) ===
function calcPayment(waiverFactor) {
    const totalInput = parseFloat(document.getElementById('total-amount').value);
    
    const buttons = document.querySelectorAll('.waiver-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (isNaN(totalInput)) {
        alert("Please enter a valid amount!");
        return;
    }

    const regFee = 6500;

    if (totalInput < regFee) {
        alert("Total amount cannot be less than Registration Fee (6500/-)");
        return;
    }

    // 1. Separate Tuition
    const tuitionFee = totalInput - regFee;

    // 2. Apply Waiver on Tuition
    const payableTuition = tuitionFee * waiverFactor; 
    const waiverAmount = tuitionFee - payableTuition;

    // 3. Add Reg Fee back
    const netPayable = payableTuition + regFee;

    // Installments
    const first = netPayable * 0.40;
    const second = netPayable * 0.30;
    const third = netPayable * 0.30;

    let waiverPercentText = "None";
    if (waiverFactor === 0.75) waiverPercentText = "25%";
    else if (waiverFactor === 0.50) waiverPercentText = "50%";
    else if (waiverFactor === 0) waiverPercentText = "100%";

    const resultBox = document.getElementById('payment-result');
    resultBox.style.display = 'block';
    resultBox.innerText = 
`PAYMENT BREAKDOWN (Waiver: ${waiverPercentText})
-----------------------------------
Registration Fee: 6500/- (Fixed, No Waiver)
Tuition Fee     : ${tuitionFee}/-
Waiver Discount : -${waiverAmount.toFixed(0)}/-
-----------------------------------
NET PAYABLE     : ${netPayable.toFixed(0)}/-

INSTALLMENTS:
1st (40%): ${first.toFixed(0)}/-
2nd (30%): ${second.toFixed(0)}/-
3rd (30%): ${third.toFixed(0)}/-

Thank you!`;
}