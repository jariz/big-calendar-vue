<template>
  <div class="p-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <YearViewMonth
        v-for="month in months"
        :key="month.toString()"
        :month="month"
        :events="allEvents"
        @event-click="$emit('event-click', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { addMonths, startOfYear } from "date-fns";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import YearViewMonth from "./YearViewMonth.vue";
import type { IEvent } from "@/calendar/interfaces";

interface Props {
  allEvents: IEvent[];
}

defineProps<Props>();

defineEmits<{
  "event-click": [event: IEvent];
}>();

const { selectedDate } = useCalendar();

const months = computed(() => {
  const yearStart = startOfYear(selectedDate.value);
  return Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));
});
</script>
