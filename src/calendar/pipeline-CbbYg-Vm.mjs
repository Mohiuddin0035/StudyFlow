import { RRule, RRuleSet, rrulestr } from "rrule";
import { TZDate } from "@date-fns/tz";
import { addDays, isSameDay, startOfDay } from "date-fns";
//#region src/core/helpers.ts
function isRecurring(event) {
	return event.recurrence != null;
}
const CODE_BY_NAME = {
	sunday: "SU",
	monday: "MO",
	tuesday: "TU",
	wednesday: "WE",
	thursday: "TH",
	friday: "FR",
	saturday: "SA"
};
const NAME_BY_CODE = {
	SU: "Sunday",
	MO: "Monday",
	TU: "Tuesday",
	WE: "Wednesday",
	TH: "Thursday",
	FR: "Friday",
	SA: "Saturday"
};
/** 0 (Sun) .. 6 (Sat), matching JS `Date.getDay()`. */
const INDEX_BY_CODE = {
	SU: 0,
	MO: 1,
	TU: 2,
	WE: 3,
	TH: 4,
	FR: 5,
	SA: 6
};
const CODE_BY_INDEX = [
	"SU",
	"MO",
	"TU",
	"WE",
	"TH",
	"FR",
	"SA"
];
/** Accepts "Monday" | "monday" | "MO" | "mo" -> "MO". Returns null if unrecognized. */
function normalizeWeekday(input) {
	const s = String(input).trim();
	if (s.length === 2 && NAME_BY_CODE[s.toUpperCase()]) return s.toUpperCase();
	return CODE_BY_NAME[s.toLowerCase()] ?? null;
}
function weekdayName(code) {
	return NAME_BY_CODE[code];
}
/** Weekday code -> JS day index (0=Sun .. 6=Sat). */
function weekdayIndex(code) {
	return INDEX_BY_CODE[code];
}
/** JS day index (0=Sun .. 6=Sat) -> weekday code. */
function weekdayFromIndex(index) {
	return CODE_BY_INDEX[(index % 7 + 7) % 7];
}
/**
* Avatar fallback initials from an actor.
* "Dr. Alex Smith" -> "DS", "Emily" -> "EM", email-only -> first 2 chars, else "?".
*/
function actorInitials(actor) {
	const source = (actor.name || actor.email || "").trim();
	if (!source) return "?";
	const parts = source.split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
let __idCounter = 0;
/** Deterministic-ish unique id for events missing one. Stable within a session. */
function generateId(prefix = "evt") {
	__idCounter += 1;
	return `${prefix}_${__idCounter.toString(36)}`;
}
//#endregion
//#region src/core/timezone.ts
/** True when an ISO string carries an explicit offset ("Z" or "±HH:MM"). */
function hasOffset(iso) {
	return /([zZ]|[+-]\d{2}:?\d{2})$/.test(iso.trim());
}
const FLOATING_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?$/;
/**
* Coerce a model datetime (`ISODateTime | Date`) into an absolute instant.
*
* - A `Date` is already an instant — returned as-is.
* - An ISO string WITH an offset (`...Z`, `...+06:00`) is an instant.
* - A "floating" ISO string (no offset) is interpreted in `timezone` when given,
*   otherwise in the runtime-local zone (standard `new Date(string)` behaviour).
*/
function toInstant(value, timezone) {
	if (value instanceof Date) return value;
	if (!hasOffset(value) && timezone) {
		const m = FLOATING_RE.exec(value.trim());
		if (m) {
			const [, y, mo, d, h, mi, s] = m;
			return new TZDate(Number(y), Number(mo) - 1, Number(d), Number(h ?? 0), Number(mi ?? 0), Number(s ?? 0), timezone);
		}
	}
	return new Date(value);
}
/**
* Reinterpret an absolute instant as a wall-clock in `displayZone`. The returned
* value's local getters (`getHours`, `getDate`, `getDay`...) reflect that zone.
* With no zone, returns the instant unchanged (runtime-local zone applies).
*/
function toDisplay(instant, displayZone) {
	return displayZone ? new TZDate(instant.getTime(), displayZone) : instant;
}
/** Minutes elapsed since local midnight, in the display zone. */
function minutesSinceMidnight(instant, displayZone) {
	const d = toDisplay(instant, displayZone);
	return d.getHours() * 60 + d.getMinutes();
}
//#endregion
//#region src/core/recurrence.ts
const RRULE_WEEKDAY = {
	SU: RRule.SU,
	MO: RRule.MO,
	TU: RRule.TU,
	WE: RRule.WE,
	TH: RRule.TH,
	FR: RRule.FR,
	SA: RRule.SA
};
const FREQ = {
	daily: RRule.DAILY,
	weekly: RRule.WEEKLY,
	monthly: RRule.MONTHLY,
	yearly: RRule.YEARLY
};
function pad(n, len = 2) {
	return String(n).padStart(len, "0");
}
/**
* rrule does all its math in naive UTC. To make recurrence honour the event's
* wall clock (and DST), we enumerate the pattern in "naive UTC" — a Date whose
* UTC fields equal the local wall-clock — then rebuild the real instant per hit.
*/
function toNaiveUTC(instant, zone) {
	const d = toDisplay(instant, zone);
	return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
}
/** Inverse of {@link toNaiveUTC}: wall-clock parts → real instant in `zone`. */
function fromNaiveUTC(naive, zone) {
	return toInstant(`${pad(naive.getUTCFullYear(), 4)}-${pad(naive.getUTCMonth() + 1)}-${pad(naive.getUTCDate())}T${pad(naive.getUTCHours())}:${pad(naive.getUTCMinutes())}:${pad(naive.getUTCSeconds())}`, zone);
}
function buildOptions(rule, dtstart, zone) {
	const options = {
		freq: FREQ[rule.freq],
		dtstart,
		interval: rule.interval ?? 1
	};
	if (rule.byWeekday?.length) options.byweekday = rule.byWeekday.map((wd) => RRULE_WEEKDAY[wd]);
	if (rule.byMonthday?.length) options.bymonthday = rule.byMonthday;
	if (rule.count != null) options.count = rule.count;
	if (rule.until != null) options.until = toNaiveUTC(toInstant(rule.until, zone), zone);
	return options;
}
function makeOccurrence(event, id, start, durationMs, recurring) {
	const startDate = new Date(start.getTime());
	return {
		occurrenceId: `${id}__${startDate.toISOString()}`,
		event,
		start: startDate,
		end: new Date(startDate.getTime() + durationMs),
		allDay: event.allDay ?? false,
		isRecurring: recurring
	};
}
/**
* Expand a single event into concrete occurrences intersecting `range`.
* Non-recurring events pass through (when they overlap); recurring events are
* enumerated with rrule and have their `exceptions` (EXDATE) removed.
*/
function expandRecurrence(event, range) {
	const id = event.id ?? generateId();
	const zone = event.timezone;
	const startInstant = toInstant(event.start, zone);
	const endInstant = toInstant(event.end, zone);
	const durationMs = Math.max(0, endInstant.getTime() - startInstant.getTime());
	if (!isRecurring(event)) {
		if (endInstant.getTime() > range.start.getTime() && startInstant.getTime() < range.end.getTime()) return [makeOccurrence(event, id, startInstant, durationMs, false)];
		return [];
	}
	const dtstart = toNaiveUTC(startInstant, zone);
	let rule;
	if (typeof event.recurrence === "string") rule = rrulestr(event.recurrence, { dtstart });
	else rule = new RRule(buildOptions(event.recurrence, dtstart, zone));
	if (event.exceptions?.length) {
		const set = new RRuleSet();
		set.rrule(rule instanceof RRuleSet ? rule.rrules()[0] : rule);
		for (const exc of event.exceptions) set.exdate(toNaiveUTC(toInstant(exc, zone), zone));
		rule = set;
	}
	const afterNaive = toNaiveUTC(range.start, zone);
	const beforeNaive = toNaiveUTC(range.end, zone);
	return rule.between(afterNaive, beforeNaive, true).map((naive) => makeOccurrence(event, id, fromNaiveUTC(naive, zone), durationMs, true));
}
/** Expand many events and flatten, sorted by start. */
function expandAll(events, range) {
	return events.flatMap((e) => expandRecurrence(e, range)).sort((a, b) => a.start.getTime() - b.start.getTime());
}
//#endregion
//#region src/core/lanePack.ts
/**
* Lane-pack overlapping occurrences so they render side by side.
*
* Occurrences are grouped into maximal overlap clusters; within a cluster each
* is greedily assigned the first free column, and every member shares the
* cluster's column count (so width = 1 / laneCount). Fixes v1's overlap bug.
*/
function lanePack(occurrences) {
	const sorted = [...occurrences].sort((a, b) => {
		const ds = a.start.getTime() - b.start.getTime();
		return ds !== 0 ? ds : b.end.getTime() - a.end.getTime();
	});
	const result = [];
	let cluster = [];
	let clusterEnd = -Infinity;
	let laneEnds = [];
	const flush = () => {
		const laneCount = laneEnds.length || 1;
		for (const item of cluster) item.laneCount = laneCount;
		result.push(...cluster);
		cluster = [];
		laneEnds = [];
		clusterEnd = -Infinity;
	};
	for (const occ of sorted) {
		const start = occ.start.getTime();
		const end = occ.end.getTime();
		if (start >= clusterEnd && cluster.length > 0) flush();
		let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
		if (lane === -1) {
			lane = laneEnds.length;
			laneEnds.push(end);
		} else laneEnds[lane] = end;
		cluster.push({
			occurrence: occ,
			lane,
			laneCount: 1
		});
		clusterEnd = Math.max(clusterEnd, end);
	}
	if (cluster.length > 0) flush();
	return result;
}
//#endregion
//#region src/core/position.ts
/**
* Turn lane-packed occurrences into pixel-positioned blocks for a time grid.
* `top`/`height` are relative to the top of the day column (which starts at
* `grid.dayStartHour`). Generalized from v1's hardcoded `(hour - 8) * 60`.
*/
function positionOccurrences(packed, grid, displayZone) {
	const startOffsetMin = grid.dayStartHour * 60;
	const perMin = grid.pxPerHour / 60;
	return packed.map(({ occurrence, lane, laneCount }) => {
		const startMin = minutesSinceMidnight(occurrence.start, displayZone);
		const durationMin = Math.max(0, (occurrence.end.getTime() - occurrence.start.getTime()) / 6e4);
		const top = (startMin - startOffsetMin) * perMin;
		const height = durationMin * perMin;
		return {
			...occurrence,
			top,
			height,
			lane,
			laneCount
		};
	});
}
//#endregion
//#region src/core/pipeline.ts
/** Local midnight (in display zone) of an instant. */
function dayStartLocal(instant, zone) {
	return startOfDay(toDisplay(instant, zone));
}
/**
* Expand events over `range`, then bucket per calendar day (in the display
* zone), lane-pack overlapping timed occurrences, and compute grid positions.
* Month views consume the same buckets (ignoring `top`/`height`).
*/
function buildView(events, options) {
	const { range, grid, timeZone } = options;
	const occurrences = expandAll(events, range);
	const timed = [];
	const allDay = [];
	for (const occ of occurrences) (occ.allDay ? allDay : timed).push(occ);
	const days = [];
	let cursor = dayStartLocal(range.start, timeZone);
	const guard = 400;
	for (let i = 0; cursor.getTime() < range.end.getTime() && i < guard; i++) {
		const date = cursor;
		const dayTimed = timed.filter((o) => isSameDay(toDisplay(o.start, timeZone), date));
		const dayAllDay = allDay.filter((o) => {
			const s = dayStartLocal(o.start, timeZone).getTime();
			const e = o.end.getTime();
			return s <= date.getTime() && date.getTime() < e;
		});
		days.push({
			date,
			occurrences: positionOccurrences(lanePack(dayTimed), grid, timeZone),
			allDay: dayAllDay
		});
		cursor = addDays(cursor, 1);
	}
	return { days };
}
//#endregion
export { expandRecurrence as a, toInstant as c, isRecurring as d, normalizeWeekday as f, weekdayName as h, expandAll as i, actorInitials as l, weekdayIndex as m, positionOccurrences as n, minutesSinceMidnight as o, weekdayFromIndex as p, lanePack as r, toDisplay as s, buildView as t, generateId as u };
