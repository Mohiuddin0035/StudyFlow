import { n as UseCalendarReturn, t as UseCalendarOptions } from "./types-BH8T4_bA.mjs";
import { ReactNode } from "react";

//#region src/react/useCalendar.d.ts
declare function useCalendar<TMeta = Record<string, unknown>>(options: UseCalendarOptions<TMeta>): UseCalendarReturn<TMeta>;
//#endregion
//#region src/react/useNow.d.ts
/**
 * SSR-safe "current time". Returns `null` on the server and during the first
 * client render (so server + hydration markup match), then the live `Date`
 * after mount, ticking every `tickMs`. Drives the now-indicator + today
 * highlight without a hydration mismatch.
 */
declare function useNow(tickMs?: number): Date | null;
//#endregion
//#region src/react/context.d.ts
interface CalendarProviderProps {
  value: UseCalendarReturn<any>;
  children: ReactNode;
}
declare function CalendarProvider({
  value,
  children
}: CalendarProviderProps): import("react").JSX.Element;
/** Access the calendar state provided by the nearest `CalendarProvider`. */
declare function useCalendarContext<TMeta = Record<string, unknown>>(): UseCalendarReturn<TMeta>;
//#endregion
export { useCalendar as a, useNow as i, CalendarProviderProps as n, useCalendarContext as r, CalendarProvider as t };