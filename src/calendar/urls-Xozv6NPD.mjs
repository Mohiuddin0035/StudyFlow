import { c as toInstant, u as generateId } from "./pipeline-CbbYg-Vm.mjs";
//#region src/core/internal-rrule.ts
function pad$2(n, len = 2) {
	return String(n).padStart(len, "0");
}
function untilStamp(until) {
	const d = toInstant(until);
	return `${pad$2(d.getUTCFullYear(), 4)}${pad$2(d.getUTCMonth() + 1)}${pad$2(d.getUTCDate())}T${pad$2(d.getUTCHours())}${pad$2(d.getUTCMinutes())}${pad$2(d.getUTCSeconds())}Z`;
}
/** Serialize a RecurrenceRule (or pass through a raw rule string) to RRULE body. */
function ruleToRRULEString(rule) {
	if (typeof rule === "string") return rule.startsWith("RRULE:") ? rule.slice(6) : rule;
	const parts = [`FREQ=${rule.freq.toUpperCase()}`];
	if (rule.interval && rule.interval !== 1) parts.push(`INTERVAL=${rule.interval}`);
	if (rule.byWeekday?.length) parts.push(`BYDAY=${rule.byWeekday.join(",")}`);
	if (rule.byMonthday?.length) parts.push(`BYMONTHDAY=${rule.byMonthday.join(",")}`);
	if (rule.count != null) parts.push(`COUNT=${rule.count}`);
	if (rule.until != null) parts.push(`UNTIL=${untilStamp(rule.until)}`);
	return parts.join(";");
}
//#endregion
//#region src/core/ics.ts
const WEEKDAYS = [
	"SU",
	"MO",
	"TU",
	"WE",
	"TH",
	"FR",
	"SA"
];
const FREQS = [
	"daily",
	"weekly",
	"monthly",
	"yearly"
];
function pad$1(n, len = 2) {
	return String(n).padStart(len, "0");
}
/** Absolute instant -> "YYYYMMDDTHHMMSSZ" (UTC). */
function formatUTC(date) {
	return `${pad$1(date.getUTCFullYear(), 4)}${pad$1(date.getUTCMonth() + 1)}${pad$1(date.getUTCDate())}T${pad$1(date.getUTCHours())}${pad$1(date.getUTCMinutes())}${pad$1(date.getUTCSeconds())}Z`;
}
/** Instant -> "YYYYMMDD" (UTC date parts, for all-day VALUE=DATE). */
function formatDateOnly(date) {
	return `${pad$1(date.getUTCFullYear(), 4)}${pad$1(date.getUTCMonth() + 1)}${pad$1(date.getUTCDate())}`;
}
/** Escape RFC-5545 TEXT values. */
function esc(value) {
	return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function unesc(value) {
	return value.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
}
/** Fold lines to <=75 octets per RFC 5545 (continuation = CRLF + space). */
function fold(line) {
	if (line.length <= 75) return line;
	const out = [];
	let i = 0;
	while (i < line.length) {
		const chunk = i === 0 ? 75 : 74;
		out.push((i === 0 ? "" : " ") + line.slice(i, i + chunk));
		i += chunk;
	}
	return out.join("\r\n");
}
function actorLine(actor) {
	if (!actor.email) return null;
	return `ATTENDEE${actor.name ? `;CN=${esc(actor.name)}` : ""}:mailto:${actor.email}`;
}
/** Serialize events to a single RFC-5545 VCALENDAR string. */
function toICS(events) {
	const now = formatUTC(/* @__PURE__ */ new Date());
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//monzim//calendar//EN",
		"CALSCALE:GREGORIAN"
	];
	for (const event of events) {
		const uid = event.id ?? generateId();
		const startInstant = toInstant(event.start, event.timezone);
		const endInstant = toInstant(event.end, event.timezone);
		lines.push("BEGIN:VEVENT");
		lines.push(`UID:${uid}`);
		lines.push(`DTSTAMP:${now}`);
		if (event.allDay) {
			lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(startInstant)}`);
			lines.push(`DTEND;VALUE=DATE:${formatDateOnly(endInstant)}`);
		} else {
			lines.push(`DTSTART:${formatUTC(startInstant)}`);
			lines.push(`DTEND:${formatUTC(endInstant)}`);
		}
		lines.push(`SUMMARY:${esc(event.title)}`);
		if (event.location) lines.push(`LOCATION:${esc(event.location)}`);
		if (event.description) lines.push(`DESCRIPTION:${esc(event.description)}`);
		if (event.url) lines.push(`URL:${event.url}`);
		if (event.recurrence) lines.push(`RRULE:${ruleToRRULEString(event.recurrence)}`);
		if (event.exceptions?.length) lines.push(`EXDATE:${event.exceptions.map((e) => formatUTC(toInstant(e, event.timezone))).join(",")}`);
		for (const actor of event.actors ?? []) {
			const line = actorLine(actor);
			if (line) lines.push(line);
		}
		lines.push("END:VEVENT");
	}
	lines.push("END:VCALENDAR");
	return lines.map(fold).join("\r\n");
}
/** ICS datetime token -> ISO instant string. */
function icsToISO(value, tzid) {
	const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?$/.exec(value);
	if (!m) return value;
	const [, y, mo, d, h, mi, s, z] = m;
	if (!h) return `${y}-${mo}-${d}`;
	const floating = `${y}-${mo}-${d}T${h}:${mi}:${s}`;
	if (z) return (/* @__PURE__ */ new Date(`${floating}Z`)).toISOString();
	return toInstant(floating, tzid).toISOString();
}
function parseRRULE(value) {
	const map = /* @__PURE__ */ new Map();
	for (const part of value.split(";")) {
		const [k, v] = part.split("=");
		if (k && v) map.set(k.toUpperCase(), v);
	}
	const freqRaw = (map.get("FREQ") ?? "WEEKLY").toLowerCase();
	const rule = { freq: FREQS.includes(freqRaw) ? freqRaw : "weekly" };
	const interval = map.get("INTERVAL");
	if (interval) rule.interval = Number(interval);
	const byday = map.get("BYDAY");
	if (byday) rule.byWeekday = byday.split(",").map((d) => d.replace(/^[+-]?\d+/, "").toUpperCase()).filter((d) => WEEKDAYS.includes(d));
	const bymonthday = map.get("BYMONTHDAY");
	if (bymonthday) rule.byMonthday = bymonthday.split(",").map(Number);
	const count = map.get("COUNT");
	if (count) rule.count = Number(count);
	const until = map.get("UNTIL");
	if (until) rule.until = icsToISO(until);
	return rule;
}
/** Split a content line into "NAME;params" and "value", returning parts. */
function splitLine(line) {
	const colon = line.indexOf(":");
	const head = line.slice(0, colon);
	const value = line.slice(colon + 1);
	const [name, ...paramParts] = head.split(";");
	const params = /* @__PURE__ */ new Map();
	for (const p of paramParts) {
		const [k, v] = p.split("=");
		if (k && v) params.set(k.toUpperCase(), v);
	}
	return {
		name: name.toUpperCase(),
		params,
		value
	};
}
/** Parse an RFC-5545 string back into events (round-trips {@link toICS}). */
function parseICS(text) {
	const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r\n|\n|\r/);
	const events = [];
	let current = null;
	let actors = [];
	let exceptions = [];
	for (const raw of lines) {
		if (!raw) continue;
		if (raw === "BEGIN:VEVENT") {
			current = { title: "" };
			actors = [];
			exceptions = [];
			continue;
		}
		if (raw === "END:VEVENT") {
			if (current) {
				if (actors.length) current.actors = actors;
				if (exceptions.length) current.exceptions = exceptions;
				events.push(current);
			}
			current = null;
			continue;
		}
		if (!current) continue;
		const { name, params, value } = splitLine(raw);
		switch (name) {
			case "UID":
				current.id = value;
				break;
			case "SUMMARY":
				current.title = unesc(value);
				break;
			case "LOCATION":
				current.location = unesc(value);
				break;
			case "DESCRIPTION":
				current.description = unesc(value);
				break;
			case "URL":
				current.url = value;
				break;
			case "DTSTART":
				current.start = icsToISO(value, params.get("TZID"));
				if (params.get("VALUE") === "DATE") current.allDay = true;
				break;
			case "DTEND":
				current.end = icsToISO(value, params.get("TZID"));
				if (params.get("VALUE") === "DATE") current.allDay = true;
				break;
			case "RRULE":
				current.recurrence = parseRRULE(value);
				break;
			case "EXDATE":
				for (const tok of value.split(",")) exceptions.push(icsToISO(tok, params.get("TZID")));
				break;
			case "ATTENDEE": {
				const email = value.replace(/^mailto:/i, "");
				const cn = params.get("CN");
				actors.push(cn ? {
					name: unesc(cn),
					email
				} : { email });
			}
			break;
			default:
				break;
		}
	}
	return events;
}
/** Browser helper: trigger a download of the events as an .ics file. */
function downloadICS(events, filename = "calendar.ics") {
	if (typeof document === "undefined") return;
	const blob = new Blob([toICS(events)], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
//#endregion
//#region src/core/urls.ts
function pad(n, len = 2) {
	return String(n).padStart(len, "0");
}
function gcalStamp(date, allDay) {
	if (allDay) return `${pad(date.getUTCFullYear(), 4)}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
	return `${pad(date.getUTCFullYear(), 4)}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}
/**
* Deep-link into Google Calendar's pre-filled event composer.
* Includes recurrence (`recur=RRULE:...`) when the event is a routine.
*/
function toGoogleCalendarUrl(event) {
	const allDay = event.allDay ?? false;
	const start = toInstant(event.start, event.timezone);
	const end = toInstant(event.end, event.timezone);
	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: event.title,
		dates: `${gcalStamp(start, allDay)}/${gcalStamp(end, allDay)}`
	});
	if (event.description) params.set("details", event.description);
	if (event.location) params.set("location", event.location);
	let url = `https://calendar.google.com/calendar/render?${params.toString()}`;
	if (event.recurrence) url += `&recur=${encodeURIComponent(`RRULE:${ruleToRRULEString(event.recurrence)}`)}`;
	return url;
}
/**
* Deep-link into Outlook's web composer. Note: Outlook's URL scheme has no
* reliable recurrence support, so recurring events deep-link as the first
* occurrence only (use the .ics export for full recurrence).
*/
function toOutlookUrl(event) {
	const allDay = event.allDay ?? false;
	const start = toInstant(event.start, event.timezone);
	const end = toInstant(event.end, event.timezone);
	const params = new URLSearchParams({
		path: "/calendar/action/compose",
		rru: "addevent",
		subject: event.title,
		startdt: start.toISOString(),
		enddt: end.toISOString()
	});
	if (allDay) params.set("allday", "true");
	if (event.description) params.set("body", event.description);
	if (event.location) params.set("location", event.location);
	return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
//#endregion
export { toICS as a, parseICS as i, toOutlookUrl as n, downloadICS as r, toGoogleCalendarUrl as t };
