import { a as DayBucket, l as PositionedOccurrence, o as EventOccurrence, p as TimeZone, r as CalendarViewType, s as GridConfig } from "./types-B-4Xl7So.mjs";
import { t as UseCalendarOptions } from "./types-BH8T4_bA.mjs";
import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DialogPrimitive from "@radix-ui/react-dialog";

//#region src/ui/Calendar.d.ts
interface CalendarProps<TMeta = Record<string, unknown>> extends UseCalendarOptions<TMeta> {
  className?: string;
  /** Which views to offer in the toggle. Default: today / day / week / month. */
  views?: CalendarViewType[];
  /** Show the current-time line in day/today/week. Default true. */
  nowIndicator?: boolean;
  /** Show the ".ics" export button. Default true. */
  showExport?: boolean;
  exportFilename?: string;
  onEventClick?: (occurrence: PositionedOccurrence | EventOccurrence) => void;
}
declare function Calendar<TMeta = Record<string, unknown>>(props: CalendarProps<TMeta>): import("react").JSX.Element;
//#endregion
//#region src/ui/GoogleCalendarWeekly.d.ts
/**
 * Week-first preset — the spiritual successor to the original
 * `GoogleCalendarWeekly` component. Identical to `<Calendar>` but defaults to
 * the week view with a Sunday week start. Every `Calendar` prop still applies.
 */
declare function GoogleCalendarWeekly<TMeta = Record<string, unknown>>(props: CalendarProps<TMeta>): import("react").JSX.Element;
//#endregion
//#region src/ui/components/CalendarHeader.d.ts
interface CalendarHeaderProps {
  label: string;
  view: CalendarViewType;
  views: CalendarViewType[];
  onViewChange: (view: CalendarViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onExport?: () => void;
}
declare function CalendarHeader({
  label,
  view,
  views,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onExport
}: CalendarHeaderProps): import("react").JSX.Element;
//#endregion
//#region src/ui/components/TimeGrid.d.ts
interface TimeGridProps {
  days: DayBucket[];
  grid: GridConfig;
  timeZone?: TimeZone;
  now: Date | null;
  nowIndicator?: boolean;
  onEventClick?: (occurrence: PositionedOccurrence) => void;
}
declare function TimeGrid({
  days,
  grid,
  timeZone,
  now,
  nowIndicator,
  onEventClick
}: TimeGridProps): import("react").JSX.Element;
//#endregion
//#region src/ui/components/EventCard.d.ts
interface EventCardProps {
  occurrence: PositionedOccurrence;
  timeZone?: TimeZone;
  onEventClick?: (occurrence: PositionedOccurrence) => void;
}
declare function EventCard({
  occurrence,
  timeZone,
  onEventClick
}: EventCardProps): import("react").JSX.Element;
//#endregion
//#region src/ui/components/EventDialog.d.ts
interface EventDialogProps {
  occurrence: EventOccurrence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeZone?: TimeZone;
}
declare function EventDialog({
  occurrence,
  open,
  onOpenChange,
  timeZone
}: EventDialogProps): import("react").JSX.Element;
//#endregion
//#region src/ui/components/NowIndicator.d.ts
interface NowIndicatorProps {
  now: Date | null;
  grid: GridConfig;
  timeZone?: TimeZone;
}
/**
 * Horizontal "current time" line. Renders nothing on the server / first client
 * render (`now === null`) or when the time falls outside the visible window.
 */
declare function NowIndicator({
  now,
  grid,
  timeZone
}: NowIndicatorProps): import("react").JSX.Element | null;
//#endregion
//#region src/ui/views/MonthView.d.ts
interface MonthViewProps {
  days: DayBucket[];
  monthDate: Date;
  timeZone?: TimeZone;
  now: Date | null;
  onEventClick?: (occurrence: PositionedOccurrence | EventOccurrence) => void;
}
declare function MonthView({
  days,
  monthDate,
  timeZone,
  now,
  onEventClick
}: MonthViewProps): import("react").JSX.Element;
//#endregion
//#region src/ui/primitives/avatar.d.ts
declare const Avatar: React.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React.RefAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;
declare const AvatarImage: React.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React.RefAttributes<HTMLImageElement>, "ref"> & React.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React.RefAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;
//#endregion
//#region src/ui/primitives/badge.d.ts
declare const badgeVariants: (props?: ({
  variant?: "default" | "secondary" | "destructive" | "outline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
declare function Badge({
  className,
  variant,
  ...props
}: BadgeProps): React.JSX.Element;
//#endregion
//#region src/ui/primitives/button.d.ts
declare const buttonVariants: (props?: ({
  variant?: "default" | "secondary" | "outline" | "ghost" | null | undefined;
  size?: "default" | "sm" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/ui/primitives/card.d.ts
declare const Card: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CardContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/ui/primitives/dialog.d.ts
declare const Dialog: React.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const DialogClose: React.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
declare const DialogContent: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
declare function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
declare const DialogTitle: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
//#endregion
//#region src/ui/primitives/dropdown-menu.d.ts
declare const DropdownMenu: React.FC<DropdownMenuPrimitive.DropdownMenuProps>;
declare const DropdownMenuTrigger: React.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuContent: React.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
  inset?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/ui/primitives/toggle-group.d.ts
declare const ToggleGroup: React.ForwardRefExoticComponent<(Omit<ToggleGroupPrimitive.ToggleGroupSingleProps & React.RefAttributes<HTMLDivElement>, "ref"> | Omit<ToggleGroupPrimitive.ToggleGroupMultipleProps & React.RefAttributes<HTMLDivElement>, "ref">) & React.RefAttributes<HTMLDivElement>>;
declare const ToggleGroupItem: React.ForwardRefExoticComponent<Omit<ToggleGroupPrimitive.ToggleGroupItemProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/ui/lib/cn.d.ts
declare function cn(...inputs: ClassValue[]): string;
//#endregion
export { NowIndicator as A, GoogleCalendarWeekly as B, Badge as C, AvatarImage as D, AvatarFallback as E, EventCardProps as F, CalendarProps as H, TimeGrid as I, TimeGridProps as L, EventDialog as M, EventDialogProps as N, MonthView as O, EventCard as P, CalendarHeader as R, buttonVariants as S, Avatar as T, Calendar as V, DialogTitle as _, DropdownMenuCheckboxItem as a, CardContent as b, DropdownMenuLabel as c, Dialog as d, DialogClose as f, DialogHeader as g, DialogFooter as h, DropdownMenu as i, NowIndicatorProps as j, MonthViewProps as k, DropdownMenuSeparator as l, DialogDescription as m, ToggleGroup as n, DropdownMenuContent as o, DialogContent as p, ToggleGroupItem as r, DropdownMenuItem as s, cn as t, DropdownMenuTrigger as u, DialogTrigger as v, badgeVariants as w, Button as x, Card as y, CalendarHeaderProps as z };