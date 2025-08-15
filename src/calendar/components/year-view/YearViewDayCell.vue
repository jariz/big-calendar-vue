<template>
  <button
    @click="handleClick"
    type="button"
    class="flex h-11 flex-1 flex-col items-center justify-start gap-0.5 rounded-md pt-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
  >
    <div
      :class="cn(
        'flex size-6 items-center justify-center rounded-full text-xs font-medium',
        isToday(date) && 'bg-primary font-semibold text-primary-foreground'
      )"
    >
      {{ day }}
    </div>

    <div v-if="eventCount > 0" class="mt-0.5 flex gap-0.5">
      <template v-if="eventCount <= maxIndicators">
        <div
          v-for="event in events"
          :key="event.id"
          :class="cn(
            'size-1.5 rounded-full',
            getEventColorClass(event.color)
          )"
        />
      </template>
      <template v-else>
        <div
          :class="cn(
            'size-1.5 rounded-full',
            getEventColorClass(events[0].color)
          )"
        />
        <span class="text-[7px] text-muted-foreground">+{{ eventCount - 1 }}</span>
      </template>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isToday } from "date-fns";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { cn } from "@/lib/utils";
import type { IEvent } from "@/calendar/interfaces";
import type { TEventColor } from "@/calendar/types";

interface Props {
  day: number;
  date: Date;
  events: IEvent[];
}

const props = defineProps<Props>();

defineEmits<{
  "event-click": [event: IEvent];
}>();

const { setSelectedDate, setView } = useCalendar();

const maxIndicators = 3;
const eventCount = computed(() => props.events.length);

const getEventColorClass = (color: TEventColor): string => {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    gray: "bg-neutral-600"
  };
  return colorClasses[color] || "bg-neutral-600";
};

const handleClick = () => {
  setSelectedDate(props.date);
  setView("day");
};
</script>
