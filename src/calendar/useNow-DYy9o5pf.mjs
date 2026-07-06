import { s as toDisplay, t as buildView } from "./pipeline-CbbYg-Vm.mjs";
import { addDays, addMonths, addWeeks, endOfMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
//#region src/react/useCalendar.ts
const DEFAULT_GRID = {
	dayStartHour: 8,
	dayEndHour: 18,
	pxPerHour: 60
};
const ALL_DAYS = [
	0,
	1,
	2,
	3,
	4,
	5,
	6
];
/** Compute the visible [start, end) range for a view anchored at `date`. */
function rangeFor(view, date, weekStartsOn) {
	switch (view) {
		case "day":
		case "today": {
			const start = startOfDay(date);
			return {
				start,
				end: addDays(start, 1)
			};
		}
		case "month": return {
			start: startOfWeek(startOfMonth(date), { weekStartsOn }),
			end: addDays(startOfWeek(endOfMonth(date), { weekStartsOn }), 7)
		};
		default: {
			const start = startOfWeek(date, { weekStartsOn });
			return {
				start,
				end: addWeeks(start, 1)
			};
		}
	}
}
function useCalendar(options) {
	const { events, defaultView = "week", defaultDate, weekStartsOn = 0, visibleDays = ALL_DAYS, timeZone } = options;
	const grid = useMemo(() => ({
		...DEFAULT_GRID,
		...options.grid
	}), [options.grid]);
	const [view, setView] = useState(defaultView);
	const [currentDate, setCurrentDate] = useState(() => defaultDate ?? startOfDay(/* @__PURE__ */ new Date()));
	const visibleRange = useMemo(() => rangeFor(view, toDisplay(currentDate, timeZone), weekStartsOn), [
		view,
		currentDate,
		weekStartsOn,
		timeZone
	]);
	const allDays = useMemo(() => buildView(events, {
		range: visibleRange,
		grid,
		timeZone
	}).days, [
		events,
		visibleRange,
		grid,
		timeZone
	]);
	const days = useMemo(() => {
		if (view !== "week" || visibleDays.length === 7) return allDays;
		const set = new Set(visibleDays);
		return allDays.filter((d) => set.has(toDisplay(d.date, timeZone).getDay()));
	}, [
		allDays,
		view,
		visibleDays,
		timeZone
	]);
	const step = useCallback((dir) => {
		setCurrentDate((d) => {
			switch (view) {
				case "day":
				case "today": return addDays(d, dir);
				case "month": return addMonths(d, dir);
				default: return addWeeks(d, dir);
			}
		});
	}, [view]);
	return {
		view,
		setView,
		currentDate,
		setCurrentDate,
		goNext: useCallback(() => step(1), [step]),
		goPrev: useCallback(() => step(-1), [step]),
		goToday: useCallback(() => setCurrentDate(startOfDay(/* @__PURE__ */ new Date())), []),
		visibleRange,
		days,
		weekStartsOn,
		visibleDays,
		grid,
		timeZone
	};
}
//#endregion
//#region src/react/useNow.ts
/**
* SSR-safe "current time". Returns `null` on the server and during the first
* client render (so server + hydration markup match), then the live `Date`
* after mount, ticking every `tickMs`. Drives the now-indicator + today
* highlight without a hydration mismatch.
*/
function useNow(tickMs = 6e4) {
	const [now, setNow] = useState(null);
	useEffect(() => {
		setNow(/* @__PURE__ */ new Date());
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), tickMs);
		return () => clearInterval(id);
	}, [tickMs]);
	return now;
}
//#endregion
export { useCalendar as n, useNow as t };
