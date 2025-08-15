<template>
  <div v-if="hasEventsInWeek" class="hidden overflow-hidden sm:flex">
    <div class="w-18 border-b"></div>
    <div class="grid flex-1 grid-cols-7 divide-x border-b border-l">
      <div v-for="(day, dayIndex) in weekDays" :key="day.toISOString()" class="flex h-full flex-col gap-1 py-1">
        <div v-for="(row, rowIndex) in eventRows" :key="`${rowIndex}-${dayIndex}`" class="h-6.5">
          <MonthEventBadge
            v-if="getEventForPosition(row, dayIndex)"
            :event="getEventForPosition(row, dayIndex)!"
            :cell-date="startOfDay(day)"
            :position="getEventPosition(getEventForPosition(row, dayIndex)!, dayIndex)"
            @event-click="handleEventClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { parseISO, startOfDay, startOfWeek, endOfWeek, addDays, differenceInDays, isBefore, isAfter } from "date-fns";
import MonthEventBadge from "../month-view/MonthEventBadge.vue";
import type { IEvent } from "@/calendar/interfaces";

interface Props {
  selectedDate: Date;
  multiDayEvents: IEvent[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  eventClick: [event: IEvent];
}>();

const weekStart = computed(() => startOfWeek(props.selectedDate));
const weekEnd = computed(() => endOfWeek(props.selectedDate));
const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i)));

const processedEvents = computed(() => {
  return props.multiDayEvents
    .map(event => {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);
      const adjustedStart = isBefore(start, weekStart.value) ? weekStart.value : start;
      const adjustedEnd = isAfter(end, weekEnd.value) ? weekEnd.value : end;
      const startIndex = differenceInDays(adjustedStart, weekStart.value);
      const endIndex = differenceInDays(adjustedEnd, weekStart.value);

      return {
        ...event,
        adjustedStart,
        adjustedEnd,
        startIndex,
        endIndex,
      };
    })
    .sort((a, b) => {
      const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime();
      if (startDiff !== 0) return startDiff;
      return b.endIndex - b.startIndex - (a.endIndex - a.startIndex);
    });
});

const eventRows = computed(() => {
  const rows: (typeof processedEvents.value)[] = [];

  processedEvents.value.forEach(event => {
    let rowIndex = rows.findIndex(row => row.every(e => e.endIndex < event.startIndex || e.startIndex > event.endIndex));

    if (rowIndex === -1) {
      rowIndex = rows.length;
      rows.push([]);
    }

    rows[rowIndex].push(event);
  });

  return rows;
});

const hasEventsInWeek = computed(() => {
  return props.multiDayEvents.some(event => {
    const start = parseISO(event.startDate);
    const end = parseISO(event.endDate);

    return (
      // Event starts within the week
      (start >= weekStart.value && start <= weekEnd.value) ||
      // Event ends within the week
      (end >= weekStart.value && end <= weekEnd.value) ||
      // Event spans the entire week
      (start <= weekStart.value && end >= weekEnd.value)
    );
  });
});

const getEventForPosition = (row: typeof processedEvents.value, dayIndex: number) => {
  return row.find(e => e.startIndex <= dayIndex && e.endIndex >= dayIndex);
};

const getEventPosition = (event: (typeof processedEvents.value)[0], dayIndex: number): "first" | "middle" | "last" | "none" => {
  if (dayIndex === event.startIndex && dayIndex === event.endIndex) {
    return "none";
  } else if (dayIndex === event.startIndex) {
    return "first";
  } else if (dayIndex === event.endIndex) {
    return "last";
  } else {
    return "middle";
  }
};

const handleEventClick = (event: IEvent) => {
  emit("eventClick", event);
};
</script>
