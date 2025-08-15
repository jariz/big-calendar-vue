import { ref, provide, inject } from "vue";
import type { Ref } from "vue";
import type { TCalendarView, TBadgeVariant, TWorkingHours, TVisibleHours } from "@/calendar/types";

interface CalendarContext {
  selectedDate: Ref<Date>;
  view: Ref<TCalendarView>;
  badgeVariant: Ref<TBadgeVariant>;
  workingHours: Ref<TWorkingHours>;
  visibleHours: Ref<TVisibleHours>;
  setSelectedDate: (date: Date) => void;
  setView: (view: TCalendarView) => void;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  setWorkingHours: (hours: TWorkingHours) => void;
  setVisibleHours: (hours: TVisibleHours) => void;
}

const CalendarContextKey = Symbol("CalendarContext");

export function provideCalendarContext() {
  const selectedDate = ref(new Date());
  const view = ref<TCalendarView>("month");
  const badgeVariant = ref<TBadgeVariant>("colored");
  const workingHours = ref<TWorkingHours>({
    0: { from: 9, to: 17 }, // Sunday
    1: { from: 9, to: 17 }, // Monday
    2: { from: 9, to: 17 }, // Tuesday
    3: { from: 9, to: 17 }, // Wednesday
    4: { from: 9, to: 17 }, // Thursday
    5: { from: 9, to: 17 }, // Friday
    6: { from: 9, to: 17 }, // Saturday
  });
  const visibleHours = ref<TVisibleHours>({ from: 8, to: 18 });

  const setSelectedDate = (date: Date) => {
    selectedDate.value = date;
  };

  const setView = (newView: TCalendarView) => {
    view.value = newView;
  };

  const setBadgeVariant = (variant: TBadgeVariant) => {
    badgeVariant.value = variant;
  };

  const setWorkingHours = (hours: TWorkingHours) => {
    workingHours.value = hours;
  };

  const setVisibleHours = (hours: TVisibleHours) => {
    visibleHours.value = hours;
  };

  const context: CalendarContext = {
    selectedDate,
    view,
    badgeVariant,
    workingHours,
    visibleHours,
    setSelectedDate,
    setView,
    setBadgeVariant,
    setWorkingHours,
    setVisibleHours,
  };

  provide(CalendarContextKey, context);
  return context;
}

export function useCalendar(): CalendarContext {
  const context = inject(CalendarContextKey);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context as CalendarContext;
}
