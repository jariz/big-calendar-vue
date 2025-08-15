<template>
  <div class="flex flex-col">
    <button
      type="button"
      @click="handleClick"
      class="w-full rounded-t-lg border px-3 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {{ monthName }}
    </button>

    <div class="flex-1 space-y-2 rounded-b-lg border border-t-0 p-3">
      <div class="grid grid-cols-7 gap-x-0.5 text-center">
        <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="text-xs font-medium text-muted-foreground"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-x-0.5 gap-y-2">
        <template v-for="(day, index) in daysInMonth" :key="`day-${index}`">
          <div v-if="day === null" class="h-10" />
          <YearViewDayCell
            v-else
            :day="day"
            :date="new Date(month.getFullYear(), month.getMonth(), day)"
            :events="getDayEvents(new Date(month.getFullYear(), month.getMonth(), day))"
            @event-click="$emit('event-click', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { format, isSameDay, parseISO, getDaysInMonth, startOfMonth } from "date-fns";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import YearViewDayCell from "./YearViewDayCell.vue";
import type { IEvent } from "@/calendar/interfaces";

interface Props {
  month: Date;
  events: IEvent[];
}

const props = defineProps<Props>();

defineEmits<{
  "event-click": [event: IEvent];
}>();

const { setSelectedDate, setView } = useCalendar();

const monthName = computed(() => format(props.month, "MMMM"));

const daysInMonth = computed(() => {
  const totalDays = getDaysInMonth(props.month);
  const firstDay = startOfMonth(props.month).getDay();

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanks = Array(firstDay).fill(null);

  return [...blanks, ...days];
});

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDayEvents = (date: Date): IEvent[] => {
  return props.events.filter(event => 
    isSameDay(parseISO(event.startDate), date) || 
    isSameDay(parseISO(event.endDate), date)
  );
};

const handleClick = () => {
  setSelectedDate(new Date(props.month.getFullYear(), props.month.getMonth(), 1));
  setView("month");
};
</script>
