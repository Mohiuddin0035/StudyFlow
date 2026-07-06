<div align="center">

<br/>

```
   _____ _______ _    _ _______     _______ _      ______          __
  / ____|__   __| |  | |  __ \ \   / /  ___| |    / __ \ \        / /
 | (___    | |  | |  | | |  | \ \_/ /| |_  | |   | |  | \ \  /\  / / 
  \___ \   | |  | |  | | |  | |\   / |  _| | |   | |  | |\ \/  \/ /  
  ____) |  | |  | |__| | |__| | | |  | |   | |___| |__| | \  /\  /   
 |_____/   |_|   \____/|_____/  |_|  |_|   |______\____/   \/  \/    
```

<br/>

**Your personal academic sanctuary. Engineered for calm. Designed for focus.**

<br/>

[![Launch StudyFlow](https://img.shields.io/badge/◈%20%20LAUNCH%20STUDYFLOW%20%20◈-FF6B00?style=for-the-badge&logoColor=white&labelColor=cc5500)](https://studyflow-ruby.vercel.app/)

<br/>

![StudyFlow Workspace](./Screenshot%202026-07-06%20205419.png)

<br/>

</div>

---

<br/>

<div align="center">

### *"A student's workspace should not feel like a sterile university database.*
### *It should be a personal sanctuary."*

</div>

<br/>

---

<br/>

## ◈ &nbsp; What is StudyFlow?

StudyFlow is not another productivity template. It is a **hand-crafted academic operating system** — built from the ground up with an obsessive attention to both design and engineering integrity. Every pixel was placed with purpose. Every database rule was written with security in mind.

It transforms the daily chaos of university coursework into something quiet, organized, and yours.

<br/>

---

<br/>

## ◈ &nbsp; Latest Release (v26.2)

The `v26.2` update brings a high-end visual overhaul and advanced UI systems to make StudyFlow feel even more like a premium, state-of-the-art academic sanctuary:

* 🤖 **Flowy AI Buddy & Companion:** A fully interactive SVG assistant guiding you through login (waves, types, and reacts to fields) AND acting as your smart workspace buddy to answer questions, track daily goals, and organize academic tasks.
* 🎭 **Academic Multi-Profiling:** Switch context effortlessly with up to 3 isolated, custom-named student profiles. Older workspaces automatically rotate out to save Firestore capacity.
* 💳 **Interactive 3D Physics Lanyard:** Grab, swing, and spin a premium, canvas-textured 3D ID badge powered by a real-time Rapier physics simulation.
* 🔍 **Programmatic QR-Badge & Branding:** Features an on-the-fly generated GitHub QR Code inside a high-contrast zone for instant smartphone scanning, customized with a two-line name plate and favicon branding.
* 🌌 **SoftAurora Shader Backdrop:** A liquid, organic WebGL-based backdrop animating orange (`#FF7A00`) and cyan (`#34D9FF`) solar flares underneath your cover page.
* ⚡ **Preloaded Edge Assets:** Preloaded models and texture assets on app startup to guarantee instant, zero-lag transitions when connecting cards.

<br/>

---

<br/>

## ◈ &nbsp; Feature Architecture

<br/>

<table>
<tr>
<td width="50%" valign="top">

### 🕐 &nbsp; Ambient Schedule Engine

Traditional timetables are dead grids. StudyFlow treats time as something alive.

- **Real-time course highlighting** — active classes surface automatically
- **Room location mapping** — know exactly where to be, without searching
- **Ramadan Mode** — alternate seasonal schedules with a single toggle
- Weekly view that breathes and adapts

</td>
<td width="50%" valign="top">

### 📋 &nbsp; State-Driven Assessment Tracker

Deadlines should not ambush you. They should be visible — but never overwhelming.

- **Live countdown computation** for all upcoming due dates
- **Soft orange ambient glow** activates in the critical 3-day window
- Smart visual weight shifting — urgent things feel urgent, nothing else does
- Class tests and assignments in one unified view

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔐 &nbsp; The Hidden Secure Vault

True privacy is not a padlock icon. It is **complete invisibility**.

- The vault does not exist in the UI until unlocked
- Secondary **custom PIN + hint verification** layer
- Encrypted, isolated — no cross-user data exposure possible
- Quick-access link manager lives alongside it

</td>
<td width="50%" valign="top">

### 📡 &nbsp; Serverless Broadcast Panel

Platform-level communication, without breaking anyone's focus.

- Push **real-time global notices** to all connected workspaces
- Isolated backend privileges for administrators only
- Non-intrusive delivery — announcements arrive calmly
- Zero disruption to the student's current workflow

</td>
</tr>
</table>

<br/>

---

<br/>

## ◈ &nbsp; Engineering Integrity

> Beautiful design requires solid foundations.

StudyFlow completely rejects default open-access templates. Every security model was designed from scratch.

<br/>

| Layer | Component | Role | Scope |
|---|---|---|---|
| **Authentication** | Firebase Auth | Identity verification & session management | Entry gate — no UID, no access |
| **Database** | Cloud Firestore | Realtime NoSQL document storage | All reads/writes locked to `request.auth.uid` |
| **Security Rules** | Firestore Rules Engine | Server-side access control | Enforced before any data is returned |
| **Vault Gate** | Custom PIN + Hint Key | Secondary authentication layer | Decoupled from Firebase Auth entirely |
| **Vault Storage** | Encrypted Isolated Node | Hidden document store | Invisible in UI until vault is unlocked |
| **Session Cache** | Browser LocalStorage | Persistent local state | Eliminates redundant Firestore reads |
| **Mobile Bridge** | Capacitor | Native device API access | Safe-area padding, OS-level integration |
| **Hosting & CDN** | Vercel Edge Network | Global deployment & delivery | Zero cold-start, edge-cached assets |

> `NO global scraping` &nbsp;·&nbsp; `NO cross-user data exposure` &nbsp;·&nbsp; `NO open-access collection reads`

<br/>

| Principle | Implementation |
|---|---|
| 🔒 **Isolated Data Nodes** | Every data point is locked to `request.auth.uid` — no exceptions |
| ⚡ **Optimized Persistence** | Native local session caching for instant reloads |
| 📱 **Responsive Viewports** | Scales from wide desktop to mobile via Capacitor safe-area integration |
| 🛡️ **Zero Scraping Surface** | Custom Firestore rules — no global collection reads possible |

<br/>

---

<br/>

## ◈ &nbsp; Tech Stack

<br/>

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
&nbsp;
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0f172a?style=for-the-badge&logo=tailwind-css&logoColor=38bdf8)
&nbsp;
![Firebase](https://img.shields.io/badge/Cloud_Firestore-1a1a2e?style=for-the-badge&logo=firebase&logoColor=FFCA28)
&nbsp;
![Capacitor](https://img.shields.io/badge/Capacitor-1a1a2e?style=for-the-badge&logo=capacitor&logoColor=119EFF)
&nbsp;
![Lucide](https://img.shields.io/badge/Lucide_Icons-0a0a0a?style=for-the-badge&logo=lucide&logoColor=white)
&nbsp;
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

<br/>

```
           React  ──  Component-based, state-driven UI architecture
    Tailwind CSS  ──  Glassmorphism design system, utility-first
 Cloud Firestore  ──  Realtime NoSQL with strict per-user security rules
       Capacitor  ──  Native safe-area padding & mobile bridge layer
    Lucide React  ──  Cohesive, lightweight icon library
          Vercel  ──  Edge-deployed, globally distributed hosting
```

<br/>

---

<br/>

## ◈ &nbsp; Getting Started

```bash
# Clone the repository
git clone https://github.com/Mohiuddin0035/StudyFlow.git

# Navigate into the project
cd StudyFlow

# Install dependencies
npm install

# Start the development server
npm run dev
```

> **Note:** Configure your own Firebase project via a `.env` file with your credentials. Deploy the included Firestore security rules exactly as written — they are the backbone of the entire security model.

<br/>

---

<br/>

## ◈ &nbsp; Design Philosophy

<br/>

<div align="center">

```
  CALM  ─────────────────────────────────────────────────  CONTROL

   Frosted glass aesthetics            Strict database engineering
   Ambient, contextual UI              Isolated, scoped data nodes
   Invisible until needed              Always secure underneath
   Breathes with your schedule         Never leaks beyond its bounds
```

</div>

<br/>

StudyFlow was built on a single belief: **a student's relationship with their tools should feel calm, not clinical.** The interface disappears when you don't need it. It surfaces what matters exactly when you do. Privacy is not a feature here — it is the foundation.

<br/>

---

<br/>

## ◈ &nbsp; Contributing

Found a bug? Have an idea that fits the philosophy? Pull requests are welcome.

Please ensure any contribution respects the **security-first architecture** — no changes that broaden data access scope, no shortcuts around the auth layer.

<br/>

---

<br/>

<div align="center">

## ◈ &nbsp; About the Developer

<br/>

<table>
<tr>
<td align="center">

<br/>

**MOHEUDDIN SIKDER SAIKAT**

*Designer &nbsp;·&nbsp; Developer &nbsp;·&nbsp; Engineer*

<br/>

[![University](https://img.shields.io/badge/United_International_University-0a0a0a?style=for-the-badge&logoColor=white)](https://uiu.ac.bd)
&nbsp;
[![Degree](https://img.shields.io/badge/B.Sc._in_CSE-1a1a2e?style=for-the-badge&logoColor=white)](https://uiu.ac.bd)
&nbsp;
[![Batch](https://img.shields.io/badge/Batch_242-0f172a?style=for-the-badge&logoColor=white)](https://github.com/Mohiuddin0035)

<br/>



<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Mohiuddin0035-0a0a0a?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mohiuddin0035)
&nbsp;
[![StudyFlow](https://img.shields.io/badge/◈%20Visit%20StudyFlow-0a0a0a?style=for-the-badge)](https://studyflow-ruby.vercel.app/)

<br/>

</td>
</tr>
</table>

<br/>

---

`React` &nbsp;·&nbsp; `Tailwind CSS` &nbsp;·&nbsp; `Glassmorphism` &nbsp;·&nbsp; `Lucide` &nbsp;·&nbsp; `Cloud Firestore` &nbsp;·&nbsp; `Capacitor` &nbsp;·&nbsp; `Vercel`

<br/>

*© 2026 Moheuddin Sikder Saikat — StudyFlow. All rights reserved.*

</div>
