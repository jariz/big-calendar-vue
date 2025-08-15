<template>
  <div class="grid min-h-[768px] grid-rows-[auto_1fr] overflow-hidden">
    <!-- Sticky header -->
    <div class="sticky top-0 z-20 bg-background">
      <div class="grid grid-cols-7 divide-x divide-border border-b border-border">
        <div v-for="day in WEEK_DAYS" :key="day" class="flex items-center justify-center bg-muted/30 py-2">
          <span class="text-xs font-medium text-muted-foreground">{{ day }}</span>
        </div>
      </div>
    </div>

    <!-- Scrollable content -->
    <ScrollArea class="min-h-0">
      <div class="grid grid-cols-7 overflow-hidden">
        <DayCell
          v-for="cell in cells"
          :key="cell.date.toISOString()"
          :cell="cell"
          :events="filteredEvents"
          :event-positions="eventPositions"
          @event-click="handleEventClick"
        />
      </div>
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { parseISO, isSameDay } from "date-fns";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import DayCell from "./DayCell.vue";
import { getCalendarCells, calculateMonthEventPositionsForGrid } from "@/calendar/helpers";
import type { IEvent } from "@/calendar/interfaces";

interface Props {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  eventClick: [event: IEvent];
}>();

const { selectedDate } = useCalendar();

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const cells = computed(() => getCalendarCells(selectedDate.value));

// Get the date range for the entire calendar grid (including prev/next month days)
const calendarRange = computed(() => {
  const cellDates = cells.value.map(cell => cell.date);
  return {
    start: cellDates[0], // First day in grid
    end: cellDates[cellDates.length - 1], // Last day in grid
  };
});

// Filter events to only include those that could appear in the calendar grid
const filteredEvents = computed(() => {
  const { start, end } = calendarRange.value;
  return [...props.multiDayEvents, ...props.singleDayEvents].filter(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    // Include event if it overlaps with any day in the calendar grid
    return eventStart <= end && eventEnd >= start;
  });
});

const eventPositions = computed(() =>
  calculateMonthEventPositionsForGrid(
    filteredEvents.value.filter(event => !isSameDay(parseISO(event.startDate), parseISO(event.endDate))),
    filteredEvents.value.filter(event => isSameDay(parseISO(event.startDate), parseISO(event.endDate))),
    calendarRange.value.start,
    calendarRange.value.end
  )
);

const handleEventClick = (event: IEvent) => {
  emit("eventClick", event);
};
</script>
