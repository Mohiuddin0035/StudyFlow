import { c as toInstant, f as normalizeWeekday, m as weekdayIndex, u as generateId } from "./pipeline-CbbYg-Vm.mjs";
import { addDays, startOfDay } from "date-fns";
//#region src/core/fromRoutine.ts
function pad(n, len = 2) {
	return String(n).padStart(len, "0");
}
function dateOnly(d) {
	return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
/** First date on/after `base` whose weekday matches `targetIdx` (0=Sun..6=Sat). */
function nextWeekday(base, targetIdx) {
	const start = startOfDay(base);
	return addDays(start, (targetIdx - start.getDay() + 7) % 7);
}
/**
* Expand ergonomic weekly routines into canonical recurring `CalendarEvent`s.
* Schedule days that share the same time window collapse into a single event
* with a `byWeekday` rule; differing times become separate events.
*/
function fromRoutine(routines, options = {}) {
	const baseDate = options.baseDate ? toInstant(options.baseDate) : /* @__PURE__ */ new Date();
	const validFromBase = (validFrom) => validFrom ? toInstant(validFrom) : baseDate;
	const events = [];
	for (const routine of routines) {
		const groups = /* @__PURE__ */ new Map();
		for (const [rawDay, slot] of Object.entries(routine.schedule)) {
			if (!slot) continue;
			const code = normalizeWeekday(rawDay);
			if (!code) continue;
			const key = `${slot.start}-${slot.end}`;
			const group = groups.get(key);
			if (group) group.days.push(code);
			else groups.set(key, {
				slot,
				days: [code]
			});
		}
		let groupIndex = 0;
		for (const { slot, days } of groups.values()) {
			const anchorBase = validFromBase(routine.validFrom);
			const anchor = days.map((d) => nextWeekday(anchorBase, weekdayIndex(d))).sort((a, b) => a.getTime() - b.getTime())[0];
			const day = dateOnly(anchor);
			const recurrence = {
				freq: "weekly",
				byWeekday: days
			};
			if (routine.validUntil) recurrence.until = routine.validUntil;
			const baseId = routine.id ?? generateId("routine");
			events.push({
				id: groups.size > 1 ? `${baseId}__${groupIndex}` : baseId,
				title: routine.title,
				start: `${day}T${slot.start}:00`,
				end: `${day}T${slot.end}:00`,
				timezone: options.timeZone,
				recurrence,
				actors: routine.actors,
				location: routine.location,
				color: routine.color,
				calendarId: routine.calendarId,
				meta: routine.meta
			});
			groupIndex++;
		}
	}
	return events;
}
//#endregion
export { fromRoutine as t };
