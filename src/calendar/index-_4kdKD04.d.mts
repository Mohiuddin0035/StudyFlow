import { a as DayBucket, c as ISODateTime, d as RoutineInput, g as WeekdayName, h as WeekdayInput, i as DateRange, l as PositionedOccurrence, m as Weekday, n as CalendarEvent, o as EventOccurrence, p as TimeZone, s as GridConfig, t as Actor } from "./types-B-4Xl7So.mjs";

//#region src/core/helpers.d.ts
declare function isRecurring<TMeta = Record<string, unknown>>(event: CalendarEvent<TMeta>): boolean;
/** Accepts "Monday" | "monday" | "MO" | "mo" -> "MO". Returns null if unrecognized. */
declare function normalizeWeekday(input: WeekdayInput | string): Weekday | null;
declare function weekdayName(code: Weekday): WeekdayName;
/** Weekday code -> JS day index (0=Sun .. 6=Sat). */
declare function weekdayIndex(code: Weekday): number;
/** JS day index (0=Sun .. 6=Sat) -> weekday code. */
declare function weekdayFromIndex(index: number): Weekday;
/**
 * Avatar fallback initials from an actor.
 * "Dr. Alex Smith" -> "DS", "Emily" -> "EM", email-only -> first 2 chars, else "?".
 */
declare function actorInitials(actor: Actor): string;
/** Deterministic-ish unique id for events missing one. Stable within a session. */
declare function generateId(prefix?: string): string;
//#endregion
//#region src/core/recurrence.d.ts
/**
 * Expand a single event into concrete occurrences intersecting `range`.
 * Non-recurring events pass through (when they overlap); recurring events are
 * enumerated with rrule and have their `exceptions` (EXDATE) removed.
 */
declare function expandRecurrence<TMeta = Record<string, unknown>>(event: CalendarEvent<TMeta>, range: DateRange): EventOccurrence<TMeta>[];
/** Expand many events and flatten, sorted by start. */
declare function expandAll<TMeta = Record<string, unknown>>(events: CalendarEvent<TMeta>[], range: DateRange): EventOccurrence<TMeta>[];
//#endregion
//#region src/core/lanePack.d.ts
interface PackedOccurrence<TMeta = Record<string, unknown>> {
  occurrence: EventOccurrence<TMeta>;
  /** Zero-based column index within the overlap cluster. */
  lane: number;
  /** Total columns in this occurrence's overlap cluster. */
  laneCount: number;
}
/**
 * Lane-pack overlapping occurrences so they render side by side.
 *
 * Occurrences are grouped into maximal overlap clusters; within a cluster each
 * is greedily assigned the first free column, and every member shares the
 * cluster's column count (so width = 1 / laneCount). Fixes v1's overlap bug.
 */
declare function lanePack<TMeta = Record<string, unknown>>(occurrences: EventOccurrence<TMeta>[]): PackedOccurrence<TMeta>[];
//#endregion
//#region src/core/position.d.ts
/**
 * Turn lane-packed occurrences into pixel-positioned blocks for a time grid.
 * `top`/`height` are relative to the top of the day column (which starts at
 * `grid.dayStartHour`). Generalized from v1's hardcoded `(hour - 8) * 60`.
 */
declare function positionOccurrences<TMeta = Record<string, unknown>>(packed: PackedOccurrence<TMeta>[], grid: GridConfig, displayZone?: TimeZone): PositionedOccurrence<TMeta>[];
//#endregion
//#region src/core/pipeline.d.ts
interface BuildViewOptions {
  range: DateRange;
  grid: GridConfig;
  /** Display timezone. When unset, the runtime-local zone is used. */
  timeZone?: TimeZone;
}
interface BuildViewResult<TMeta = Record<string, unknown>> {
  days: DayBucket<TMeta>[];
}
/**
 * Expand events over `range`, then bucket per calendar day (in the display
 * zone), lane-pack overlapping timed occurrences, and compute grid positions.
 * Month views consume the same buckets (ignoring `top`/`height`).
 */
declare function buildView<TMeta = Record<string, unknown>>(events: CalendarEvent<TMeta>[], options: BuildViewOptions): BuildViewResult<TMeta>;
//#endregion
//#region src/core/timezone.d.ts
/**
 * Coerce a model datetime (`ISODateTime | Date`) into an absolute instant.
 *
 * - A `Date` is already an instant — returned as-is.
 * - An ISO string WITH an offset (`...Z`, `...+06:00`) is an instant.
 * - A "floating" ISO string (no offset) is interpreted in `timezone` when given,
 *   otherwise in the runtime-local zone (standard `new Date(string)` behaviour).
 */
declare function toInstant(value: ISODateTime | Date, timezone?: TimeZone): Date;
/**
 * Reinterpret an absolute instant as a wall-clock in `displayZone`. The returned
 * value's local getters (`getHours`, `getDate`, `getDay`...) reflect that zone.
 * With no zone, returns the instant unchanged (runtime-local zone applies).
 */
declare function toDisplay(instant: Date, displayZone?: TimeZone): Date;
/** Minutes elapsed since local midnight, in the display zone. */
declare function minutesSinceMidnight(instant: Date, displayZone?: TimeZone): number;
//#endregion
//#region src/core/fromRoutine.d.ts
interface FromRoutineOptions {
  /** Anchor for the first occurrence search. Default: now. */
  baseDate?: ISODateTime | Date;
  /** Timezone applied to every generated event (and used to interpret slot times). */
  timeZone?: TimeZone;
}
/**
 * Expand ergonomic weekly routines into canonical recurring `CalendarEvent`s.
 * Schedule days that share the same time window collapse into a single event
 * with a `byWeekday` rule; differing times become separate events.
 */
declare function fromRoutine<TMeta = Record<string, unknown>>(routines: RoutineInput<TMeta>[], options?: FromRoutineOptions): CalendarEvent<TMeta>[];
//#endregion
//#region src/core/ics.d.ts
/** Serialize events to a single RFC-5545 VCALENDAR string. */
declare function toICS<TMeta = Record<string, unknown>>(events: CalendarEvent<TMeta>[]): string;
/** Parse an RFC-5545 string back into events (round-trips {@link toICS}). */
declare function parseICS(text: string): CalendarEvent[];
/** Browser helper: trigger a download of the events as an .ics file. */
declare function downloadICS<TMeta = Record<string, unknown>>(events: CalendarEvent<TMeta>[], filename?: string): void;
//#endregion
//#region src/core/urls.d.ts
/**
 * Deep-link into Google Calendar's pre-filled event composer.
 * Includes recurrence (`recur=RRULE:...`) when the event is a routine.
 */
declare function toGoogleCalendarUrl<TMeta = Record<string, unknown>>(event: CalendarEvent<TMeta>): string;
/**
 * Deep-link into Outlook's web composer. Note: Outlook's URL scheme has no
 * reliable recurrence support, so recurring events deep-link as the first
 * occurrence only (use the .ics export for full recurrence).
 */
declare function toOutlookUrl<TMeta = Record<string, unknown>>(event: CalendarEvent<TMeta>): string;
//#endregion
export { weekdayFromIndex as C, normalizeWeekday as S, weekdayName as T, expandAll as _, toICS as a, generateId as b, minutesSinceMidnight as c, BuildViewOptions as d, BuildViewResult as f, lanePack as g, PackedOccurrence as h, parseICS as i, toDisplay as l, positionOccurrences as m, toOutlookUrl as n, FromRoutineOptions as o, buildView as p, downloadICS as r, fromRoutine as s, toGoogleCalendarUrl as t, toInstant as u, expandRecurrence as v, weekdayIndex as w, isRecurring as x, actorInitials as y };