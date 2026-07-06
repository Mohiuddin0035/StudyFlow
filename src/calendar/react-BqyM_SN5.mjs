import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/react/context.tsx
const CalendarContext = createContext(null);
function CalendarProvider({ value, children }) {
	return /* @__PURE__ */ jsx(CalendarContext.Provider, {
		value,
		children
	});
}
/** Access the calendar state provided by the nearest `CalendarProvider`. */
function useCalendarContext() {
	const ctx = useContext(CalendarContext);
	if (!ctx) throw new Error("useCalendarContext must be used within a <CalendarProvider>");
	return ctx;
}
//#endregion
export { useCalendarContext as n, CalendarProvider as t };
