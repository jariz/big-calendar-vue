<template>
  <div class="flex min-h-[768px] flex-col bg-background">
    <CalendarHeader />

    <div class="min-h-0 flex-1 bg-background">
      <CalendarDayView
        v-if="view === 'day'"
        :single-day-events="singleDayEvents"
        :multi-day-events="multiDayEvents"
        @event-click="handleEventClick"
        @time-slot-click="handleTimeSlotClick"
      />
      <CalendarMonthView v-else-if="view === 'month'" :single-day-events="singleDayEvents" :multi-day-events="multiDayEvents" @event-click="handleEventClick" />
      <CalendarWeekView
        v-else-if="view === 'week'"
        :single-day-events="singleDayEvents"
        :multi-day-events="multiDayEvents"
        @event-click="handleEventClick"
        @time-slot-click="handleTimeSlotClick"
      />
      <CalendarYearView
        v-else-if="view === 'year'"
        :all-events="events"
        @event-click="handleEventClick"
      />
    </div>

    <EventDetailsDialog :event="selectedEvent" :open="isDialogOpen" @update:open="isDialogOpen = $event" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { parseISO, isSameDay } from "date-fns";
import { provideCalendarContext } from "@/calendar/contexts/calendar-context";
import CalendarHeader from "./CalendarHeader.vue";
import CalendarDayView from "./day-view/CalendarDayView.vue";
import CalendarMonthView from "./month-view/CalendarMonthView.vue";
import CalendarWeekView from "./week-view/CalendarWeekView.vue";
import CalendarYearView from "./year-view/CalendarYearView.vue";
import EventDetailsDialog from "./dialogs/EventDetailsDialog.vue";
import { CALENDAR_ITEMS_MOCK } from "@/calendar/mocks";
import type { IEvent } from "@/calendar/interfaces";

// Initialize the calendar context and get the calendar state
const { view } = provideCalendarContext();

const events = CALENDAR_ITEMS_MOCK;
const selectedEvent = ref<IEvent | null>(null);
const isDialogOpen = ref(false);

const singleDayEvents = computed(() => events.filter(event => isSameDay(parseISO(event.startDate), parseISO(event.endDate))));

const multiDayEvents = computed(() => events.filter(event => !isSameDay(parseISO(event.startDate), parseISO(event.endDate))));

const handleEventClick = (event: IEvent) => {
  selectedEvent.value = event;
  isDialogOpen.value = true;
};

const handleTimeSlotClick = (date: Date, hour: number, minute: number) => {
  console.log("Time slot clicked:", { date, hour, minute });
  // Here you would typically open an add event dialog
};
</script>
