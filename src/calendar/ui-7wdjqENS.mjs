import { l as actorInitials, o as minutesSinceMidnight, s as toDisplay } from "./pipeline-CbbYg-Vm.mjs";
import { n as toOutlookUrl, r as downloadICS, t as toGoogleCalendarUrl } from "./urls-Xozv6NPD.mjs";
import { n as useCalendar, t as useNow } from "./useNow-DYy9o5pf.mjs";
import { addDays, format, isSameDay, isSameMonth } from "date-fns";
import * as React from "react";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
//#region src/ui/lib/cn.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/ui/primitives/button.tsx
const buttonVariants = cva("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			icon: "h-8 w-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/ui/primitives/toggle-group.tsx
const ToggleGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToggleGroupPrimitive.Root, {
	ref,
	className: cn("inline-flex items-center gap-0.5 rounded-lg border bg-muted/40 p-0.5", className),
	...props
}));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
const ToggleGroupItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(ToggleGroupPrimitive.Item, {
	ref,
	className: cn("inline-flex h-7 items-center justify-center rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors", "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm", className),
	...props,
	children
}));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
//#endregion
//#region src/ui/components/icons.tsx
function base(props) {
	return {
		width: 16,
		height: 16,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...props
	};
}
const ChevronLeft = (p) => /* @__PURE__ */ jsx("svg", {
	...base(p),
	children: /* @__PURE__ */ jsx("path", { d: "m15 18-6-6 6-6" })
});
const ChevronRight = (p) => /* @__PURE__ */ jsx("svg", {
	...base(p),
	children: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" })
});
const ClockIcon = (p) => /* @__PURE__ */ jsxs("svg", {
	...base(p),
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ jsx("path", { d: "M12 6v6l4 2" })]
});
const MapPin = (p) => /* @__PURE__ */ jsxs("svg", {
	...base(p),
	children: [/* @__PURE__ */ jsx("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }), /* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "10",
		r: "3"
	})]
});
const DownloadIcon = (p) => /* @__PURE__ */ jsxs("svg", {
	...base(p),
	children: [
		/* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
		/* @__PURE__ */ jsx("path", { d: "M7 10l5 5 5-5" }),
		/* @__PURE__ */ jsx("path", { d: "M12 15V3" })
	]
});
const XIcon = (p) => /* @__PURE__ */ jsxs("svg", {
	...base(p),
	children: [/* @__PURE__ */ jsx("path", { d: "M18 6 6 18" }), /* @__PURE__ */ jsx("path", { d: "m6 6 12 12" })]
});
const ChevronDown = (p) => /* @__PURE__ */ jsx("svg", {
	...base(p),
	children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
});
const CheckIcon = (p) => /* @__PURE__ */ jsx("svg", {
	...base(p),
	children: /* @__PURE__ */ jsx("path", { d: "M20 6 9 17l-5-5" })
});
const ExternalLink = (p) => /* @__PURE__ */ jsxs("svg", {
	...base(p),
	children: [
		/* @__PURE__ */ jsx("path", { d: "M15 3h6v6" }),
		/* @__PURE__ */ jsx("path", { d: "M10 14 21 3" }),
		/* @__PURE__ */ jsx("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" })
	]
});
const CalendarIcon = (p) => /* @__PURE__ */ jsxs("svg", {
	...base(p),
	children: [
		/* @__PURE__ */ jsx("path", { d: "M8 2v4" }),
		/* @__PURE__ */ jsx("path", { d: "M16 2v4" }),
		/* @__PURE__ */ jsx("rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "4",
			rx: "2"
		}),
		/* @__PURE__ */ jsx("path", { d: "M3 10h18" })
	]
});
//#endregion
//#region src/ui/primitives/dropdown-menu.tsx
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("gcal-root z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors", "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	checked,
	className: cn("relative flex cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2.5 text-sm outline-none transition-colors", "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-3.5 w-3.5" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2.5 py-1.5 text-xs font-medium text-muted-foreground", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-border", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
//#endregion
//#region src/ui/components/CalendarHeader.tsx
const VIEW_LABELS = {
	today: "Today",
	day: "Day",
	week: "Week",
	month: "Month"
};
function CalendarHeader({ label, view, views, onViewChange, onPrev, onNext, onToday, onExport }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-3 py-2.5 sm:px-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex min-w-0 items-center gap-2",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center rounded-lg border",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onPrev,
							"aria-label": "Previous",
							className: "flex h-8 w-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx("span", { className: "h-5 w-px bg-border" }),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onNext,
							"aria-label": "Next",
							className: "flex h-8 w-8 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					size: "sm",
					onClick: onToday,
					className: "hidden sm:inline-flex",
					children: "Today"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "truncate text-sm font-semibold tracking-tight tabular-nums sm:text-base",
					children: label
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ jsx(ToggleGroup, {
					type: "single",
					value: view,
					onValueChange: (v) => v && onViewChange(v),
					className: "hidden sm:inline-flex",
					children: views.map((v) => /* @__PURE__ */ jsx(ToggleGroupItem, {
						value: v,
						"aria-label": VIEW_LABELS[v],
						children: VIEW_LABELS[v]
					}, v))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "sm:hidden",
					children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							children: [VIEW_LABELS[view], /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 opacity-60" })]
						})
					}), /* @__PURE__ */ jsx(DropdownMenuContent, {
						align: "end",
						children: views.map((v) => /* @__PURE__ */ jsx(DropdownMenuItem, {
							onSelect: () => onViewChange(v),
							children: VIEW_LABELS[v]
						}, v))
					})] })
				}),
				onExport ? /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onExport,
					"aria-label": "Export .ics",
					title: "Export .ics",
					children: /* @__PURE__ */ jsx(DownloadIcon, { className: "h-4 w-4" })
				}) : null
			]
		})]
	});
}
//#endregion
//#region src/ui/primitives/avatar.tsx
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-[0.625rem] font-medium", className),
	...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//#endregion
//#region src/ui/components/EventCard.tsx
function fmt(date, tz) {
	return format(toDisplay(date, tz), "h:mm");
}
const GAP = 3;
function EventCard({ occurrence, timeZone, onEventClick }) {
	const { event, top, height, lane, laneCount } = occurrence;
	const widthPct = 100 / laneCount;
	const interactive = !!onEventClick;
	const compact = height < 46;
	const roomy = height >= 72;
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: interactive ? () => onEventClick(occurrence) : void 0,
		disabled: !interactive,
		style: {
			top,
			height: Math.max(height, 20),
			left: `calc(${lane * widthPct}% + ${lane === 0 ? 0 : GAP}px)`,
			width: `calc(${widthPct}% - ${lane === laneCount - 1 ? 0 : GAP}px)`
		},
		className: cn("group absolute z-10 flex flex-col overflow-hidden rounded-lg border bg-card px-2 py-1 text-left shadow-xs ring-0", "transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", interactive && "cursor-pointer hover:bg-accent hover:shadow-sm"),
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ jsx("span", {
					"aria-hidden": true,
					className: "h-2 w-2 shrink-0 rounded-full bg-primary",
					style: event.color ? { backgroundColor: event.color } : void 0
				}), /* @__PURE__ */ jsx("span", {
					className: "truncate text-xs font-semibold leading-tight",
					children: event.title
				})]
			}),
			!compact ? /* @__PURE__ */ jsxs("span", {
				className: "truncate pl-3.5 text-[0.6875rem] leading-tight text-muted-foreground tabular-nums",
				children: [
					fmt(occurrence.start, timeZone),
					" – ",
					fmt(occurrence.end, timeZone)
				]
			}) : null,
			roomy && event.location ? /* @__PURE__ */ jsx("span", {
				className: "truncate pl-3.5 text-[0.6875rem] leading-tight text-muted-foreground",
				children: event.location
			}) : null,
			roomy && event.actors?.length ? /* @__PURE__ */ jsxs("span", {
				className: "mt-auto flex items-center gap-1.5 pt-1",
				children: [/* @__PURE__ */ jsxs(Avatar, {
					className: "h-4 w-4",
					children: [event.actors[0].avatarUrl ? /* @__PURE__ */ jsx(AvatarImage, {
						src: event.actors[0].avatarUrl,
						alt: event.actors[0].name ?? ""
					}) : null, /* @__PURE__ */ jsx(AvatarFallback, {
						className: "text-[0.5rem]",
						children: actorInitials(event.actors[0])
					})]
				}), event.actors[0].name ? /* @__PURE__ */ jsx("span", {
					className: "truncate text-[0.6875rem] text-muted-foreground",
					children: event.actors[0].name
				}) : null]
			}) : null
		]
	});
}
//#endregion
//#region src/ui/components/NowIndicator.tsx
/**
* Horizontal "current time" line. Renders nothing on the server / first client
* render (`now === null`) or when the time falls outside the visible window.
*/
function NowIndicator({ now, grid, timeZone }) {
	if (!now) return null;
	const minutes = minutesSinceMidnight(now, timeZone);
	const windowStart = grid.dayStartHour * 60;
	const windowEnd = grid.dayEndHour * 60;
	if (minutes < windowStart || minutes > windowEnd) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "gcal-now-indicator pointer-events-none absolute inset-x-0 z-20 flex items-center",
		style: { top: (minutes - windowStart) / 60 * grid.pxPerHour },
		children: [/* @__PURE__ */ jsx("span", { className: "-ml-1 h-2.5 w-2.5 rounded-full bg-destructive shadow-sm" }), /* @__PURE__ */ jsx("span", { className: "h-px w-full bg-destructive/80" })]
	});
}
//#endregion
//#region src/ui/components/TimeGrid.tsx
const GUTTER_PX = 56;
const MIN_COL_PX = 116;
function hourLabel(hour) {
	return `${(hour + 11) % 12 + 1} ${hour < 12 || hour === 24 ? "AM" : "PM"}`;
}
function TimeGrid({ days, grid, timeZone, now, nowIndicator = true, onEventClick }) {
	const { dayStartHour, dayEndHour, pxPerHour } = grid;
	const hours = [];
	for (let h = dayStartHour; h < dayEndHour; h++) hours.push(h);
	const bodyHeight = (dayEndHour - dayStartHour) * pxPerHour;
	const today = now ? toDisplay(now, timeZone) : null;
	const cols = `${GUTTER_PX}px repeat(${days.length}, minmax(0, 1fr))`;
	const minWidth = days.length > 1 ? GUTTER_PX + days.length * MIN_COL_PX : void 0;
	const hasAllDay = days.some((d) => d.allDay.length > 0);
	return /* @__PURE__ */ jsx("div", {
		className: "gcal-scroll relative overflow-x-auto",
		children: /* @__PURE__ */ jsxs("div", {
			style: { minWidth },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "sticky top-0 z-30 grid border-b bg-card",
					style: { gridTemplateColumns: cols },
					children: [/* @__PURE__ */ jsx("div", { className: "sticky left-0 z-10 border-r bg-card" }), days.map((day) => {
						const local = toDisplay(day.date, timeZone);
						const isToday = today ? isSameDay(local, today) : false;
						return /* @__PURE__ */ jsxs("div", {
							className: "px-1 py-2 text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground",
								children: format(local, "EEE")
							}), /* @__PURE__ */ jsx("div", {
								className: cn("mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors", isToday && "bg-primary text-primary-foreground"),
								children: format(local, "d")
							})]
						}, day.date.toISOString());
					})]
				}),
				hasAllDay ? /* @__PURE__ */ jsxs("div", {
					className: "grid border-b",
					style: { gridTemplateColumns: cols },
					children: [/* @__PURE__ */ jsx("div", {
						className: "sticky left-0 z-10 flex items-center justify-end border-r bg-card px-2 py-1 text-[0.625rem] uppercase tracking-wide text-muted-foreground",
						children: "All day"
					}), days.map((day) => /* @__PURE__ */ jsx("div", {
						className: "min-h-8 space-y-1 border-r p-1 last:border-r-0",
						children: day.allDay.map((occ) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							disabled: !onEventClick,
							onClick: onEventClick ? () => onEventClick(occ) : void 0,
							className: cn("flex w-full items-center gap-1.5 truncate rounded-md border bg-card px-1.5 py-0.5 text-left text-xs", onEventClick && "cursor-pointer hover:bg-accent"),
							children: [/* @__PURE__ */ jsx("span", {
								"aria-hidden": true,
								className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary",
								style: occ.event.color ? { backgroundColor: occ.event.color } : void 0
							}), /* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: occ.event.title
							})]
						}, occ.occurrenceId))
					}, day.date.toISOString()))]
				}) : null,
				/* @__PURE__ */ jsxs("div", {
					className: "grid",
					style: { gridTemplateColumns: cols },
					children: [/* @__PURE__ */ jsx("div", {
						className: "sticky left-0 z-10 border-r bg-card",
						children: hours.map((h) => /* @__PURE__ */ jsx("div", {
							className: "relative",
							style: { height: pxPerHour },
							children: /* @__PURE__ */ jsx("span", {
								className: "absolute -top-2 right-2 text-[0.625rem] tabular-nums text-muted-foreground",
								children: hourLabel(h)
							})
						}, h))
					}), days.map((day) => {
						const local = toDisplay(day.date, timeZone);
						const isToday = today ? isSameDay(local, today) : false;
						return /* @__PURE__ */ jsxs("div", {
							className: cn("relative border-r last:border-r-0", isToday && "bg-primary/[0.03]"),
							style: { height: bodyHeight },
							children: [
								hours.map((h, i) => /* @__PURE__ */ jsx("div", {
									className: cn("border-b border-border/60", i === 0 && "border-t-0"),
									style: { height: pxPerHour }
								}, h)),
								day.occurrences.map((occ) => /* @__PURE__ */ jsx(EventCard, {
									occurrence: occ,
									timeZone,
									onEventClick
								}, occ.occurrenceId)),
								nowIndicator && isToday ? /* @__PURE__ */ jsx(NowIndicator, {
									now,
									grid,
									timeZone
								}) : null
							]
						}, day.date.toISOString());
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/ui/primitives/dialog.tsx
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("gcal-root fixed left-1/2 top-1/2 z-[250] grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border bg-card p-5 text-card-foreground shadow-xl", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: [/* @__PURE__ */ jsx(XIcon, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex flex-col gap-1 pr-6", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-base font-semibold leading-snug tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
//#region src/ui/components/EventDialog.tsx
function Row({ icon, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-2.5 text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mt-0.5 text-muted-foreground",
			children: icon
		}), /* @__PURE__ */ jsx("span", {
			className: "min-w-0 flex-1",
			children
		})]
	});
}
function openUrl(url) {
	if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
}
function EventDialog({ occurrence, open, onOpenChange, timeZone }) {
	const event = occurrence?.event;
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsx(DialogContent, { children: occurrence && event ? /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					"aria-hidden": true,
					className: "h-2.5 w-2.5 shrink-0 rounded-full bg-primary",
					style: event.color ? { backgroundColor: event.color } : void 0
				}), /* @__PURE__ */ jsx(DialogTitle, { children: event.title })]
			}), event.calendarId ? /* @__PURE__ */ jsx(DialogDescription, { children: event.calendarId }) : null] }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ jsx(Row, {
						icon: /* @__PURE__ */ jsx(CalendarIcon, { className: "h-4 w-4" }),
						children: format(toDisplay(occurrence.start, timeZone), "EEEE, MMMM d, yyyy")
					}),
					/* @__PURE__ */ jsxs(Row, {
						icon: /* @__PURE__ */ jsx(ClockIcon, { className: "h-4 w-4" }),
						children: [occurrence.allDay ? "All day" : `${format(toDisplay(occurrence.start, timeZone), "h:mm a")} – ${format(toDisplay(occurrence.end, timeZone), "h:mm a")}`, occurrence.isRecurring ? /* @__PURE__ */ jsx("span", {
							className: "ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground",
							children: "repeats"
						}) : null]
					}),
					event.location ? /* @__PURE__ */ jsx(Row, {
						icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
						children: event.location
					}) : null,
					event.description ? /* @__PURE__ */ jsx("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: event.description
					}) : null,
					event.actors?.length ? /* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-2 border-t pt-3",
						children: event.actors.map((actor, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsxs(Avatar, {
								className: "h-7 w-7",
								children: [actor.avatarUrl ? /* @__PURE__ */ jsx(AvatarImage, {
									src: actor.avatarUrl,
									alt: actor.name ?? ""
								}) : null, /* @__PURE__ */ jsx(AvatarFallback, { children: actorInitials(actor) })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-sm font-medium leading-tight",
									children: actor.name ?? actor.email ?? "Unknown"
								}), actor.role ? /* @__PURE__ */ jsx("div", {
									className: "truncate text-xs text-muted-foreground",
									children: actor.role
								}) : null]
							})]
						}, actor.id ?? actor.email ?? i))
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs(DialogFooter, {
				className: "border-t pt-3",
				children: [
					/* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => openUrl(toGoogleCalendarUrl(event)),
						children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }), "Google"]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => openUrl(toOutlookUrl(event)),
						children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }), "Outlook"]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => downloadICS([event], `${event.title}.ics`),
						children: [/* @__PURE__ */ jsx(DownloadIcon, { className: "h-3.5 w-3.5" }), ".ics"]
					})
				]
			})
		] }) : /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Event" }) }) })
	});
}
//#endregion
//#region src/ui/views/MonthView.tsx
const MAX_CHIPS = 3;
function MonthView({ days, monthDate, timeZone, now, onEventClick }) {
	const today = now ? toDisplay(now, timeZone) : null;
	const monthLocal = toDisplay(monthDate, timeZone);
	return /* @__PURE__ */ jsx("div", {
		className: "gcal-scroll overflow-x-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "min-w-[36rem]",
			children: [/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-7 border-b",
				children: days.slice(0, 7).map((day) => /* @__PURE__ */ jsx("div", {
					className: "px-2 py-2 text-center text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground",
					children: format(toDisplay(day.date, timeZone), "EEE")
				}, day.date.toISOString()))
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-7",
				children: days.map((day) => {
					const local = toDisplay(day.date, timeZone);
					const isToday = today ? isSameDay(local, today) : false;
					const inMonth = isSameMonth(local, monthLocal);
					const chips = [...day.allDay, ...day.occurrences];
					const shown = chips.slice(0, MAX_CHIPS);
					const overflow = chips.length - shown.length;
					return /* @__PURE__ */ jsxs("div", {
						className: cn("min-h-[5.5rem] space-y-0.5 border-b border-r p-1 sm:min-h-28 sm:p-1.5", "[&:nth-child(7n)]:border-r-0", !inMonth && "bg-muted/20"),
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ jsx("span", {
									className: cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium tabular-nums", isToday && "bg-primary text-primary-foreground", !inMonth && !isToday && "text-muted-foreground"),
									children: format(local, "d")
								})
							}),
							shown.map((occ) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: !onEventClick,
								onClick: onEventClick ? () => onEventClick(occ) : void 0,
								className: cn("flex w-full items-center gap-1.5 truncate rounded-md px-1.5 py-0.5 text-left text-xs transition-colors", onEventClick && "cursor-pointer hover:bg-accent"),
								children: [/* @__PURE__ */ jsx("span", {
									"aria-hidden": true,
									className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary",
									style: occ.event.color ? { backgroundColor: occ.event.color } : void 0
								}), /* @__PURE__ */ jsx("span", {
									className: "truncate text-foreground/90",
									children: occ.event.title
								})]
							}, occ.occurrenceId)),
							overflow > 0 ? /* @__PURE__ */ jsxs("div", {
								className: "px-1.5 text-[0.625rem] font-medium text-muted-foreground",
								children: [
									"+",
									overflow,
									" more"
								]
							}) : null
						]
					}, day.date.toISOString());
				})
			})]
		})
	});
}
//#endregion
//#region src/ui/Calendar.tsx
const DEFAULT_VIEWS = [
	"today",
	"day",
	"week",
	"month"
];
function rangeLabel(view, start, end, current, tz) {
	if (view === "month") return format(toDisplay(current, tz), "MMMM yyyy");
	if (view === "day" || view === "today") return format(toDisplay(current, tz), "EEE, MMM d, yyyy");
	const first = toDisplay(start, tz);
	const last = toDisplay(addDays(end, -1), tz);
	return `${format(first, "MMM d")} – ${format(last, "MMM d, yyyy")}`;
}
function Calendar(props) {
	const { className, views = DEFAULT_VIEWS, nowIndicator = true, showExport = true, exportFilename = "calendar.ics", onEventClick, ...calendarOptions } = props;
	const cal = useCalendar(calendarOptions);
	const now = useNow();
	const label = useMemo(() => rangeLabel(cal.view, cal.visibleRange.start, cal.visibleRange.end, cal.currentDate, cal.timeZone), [
		cal.view,
		cal.visibleRange,
		cal.currentDate,
		cal.timeZone
	]);
	const handleExport = showExport ? () => downloadICS(calendarOptions.events, exportFilename) : void 0;
	const [selected, setSelected] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const handleEventClick = onEventClick ? onEventClick : (occ) => {
		setSelected(occ);
		setDialogOpen(true);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("gcal-root flex w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground", className),
		children: [
			/* @__PURE__ */ jsx(CalendarHeader, {
				label,
				view: cal.view,
				views,
				onViewChange: cal.setView,
				onPrev: cal.goPrev,
				onNext: cal.goNext,
				onToday: cal.goToday,
				onExport: handleExport
			}),
			cal.view === "month" ? /* @__PURE__ */ jsx(MonthView, {
				days: cal.days,
				monthDate: cal.currentDate,
				timeZone: cal.timeZone,
				now,
				onEventClick: handleEventClick
			}) : /* @__PURE__ */ jsx(TimeGrid, {
				days: cal.days,
				grid: cal.grid,
				timeZone: cal.timeZone,
				now,
				nowIndicator,
				onEventClick: handleEventClick
			}),
			onEventClick ? null : /* @__PURE__ */ jsx(EventDialog, {
				occurrence: selected,
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				timeZone: cal.timeZone
			})
		]
	});
}
//#endregion
//#region src/ui/GoogleCalendarWeekly.tsx
/**
* Week-first preset — the spiritual successor to the original
* `GoogleCalendarWeekly` component. Identical to `<Calendar>` but defaults to
* the week view with a Sunday week start. Every `Calendar` prop still applies.
*/
function GoogleCalendarWeekly(props) {
	return /* @__PURE__ */ jsx(Calendar, {
		defaultView: "week",
		weekStartsOn: 0,
		...props
	});
}
//#endregion
//#region src/ui/primitives/badge.tsx
const badgeVariants = cva("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground",
		secondary: "border-transparent bg-secondary text-secondary-foreground",
		destructive: "border-transparent bg-destructive text-destructive-foreground",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/ui/primitives/card.tsx
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow-sm", className),
	...props
}));
Card.displayName = "Card";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
//#endregion
export { DropdownMenuTrigger as A, CalendarHeader as C, DropdownMenuItem as D, DropdownMenuContent as E, cn as F, ToggleGroupItem as M, Button as N, DropdownMenuLabel as O, buttonVariants as P, AvatarImage as S, DropdownMenuCheckboxItem as T, TimeGrid as _, GoogleCalendarWeekly as a, Avatar as b, EventDialog as c, DialogContent as d, DialogDescription as f, DialogTrigger as g, DialogTitle as h, badgeVariants as i, ToggleGroup as j, DropdownMenuSeparator as k, Dialog as l, DialogHeader as m, CardContent as n, Calendar as o, DialogFooter as p, Badge as r, MonthView as s, Card as t, DialogClose as u, NowIndicator as v, DropdownMenu as w, AvatarFallback as x, EventCard as y };
