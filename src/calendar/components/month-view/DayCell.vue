<template>
  <div
    :class="
      cn(
        'flex h-full min-h-[120px] flex-col gap-1 border-l border-t border-border py-1.5 transition-colors hover:bg-muted/50 lg:py-2',
        isSunday && 'border-l-0'
      )
    "
  >
    <span
      :class="
        cn(
          'h-6 px-1 text-xs font-semibold lg:px-2',
          !cell.currentMonth && 'opacity-20',
          isToday(cell.date) && 'flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground'
        )
      "
    >
      {{ cell.day }}
    </span>

    <div :class="cn('flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0', !cell.currentMonth && 'opacity-50')">
      <div v-for="position in [0, 1, 2]" :key="`position-${position}`" class="lg:flex-1">
        <template v-if="getEventAtPosition(position)">
          <EventBullet class="lg:hidden" :color="getEventAtPosition(position)!.color" :current-month="cell.currentMonth" />
          <MonthEventBadge
            class="hidden transition-all duration-200 hover:scale-105 hover:shadow-sm lg:flex"
            :event="getEventAtPosition(position)!"
            :cell-date="startOfDay(cell.date)"
            :current-month="cell.currentMonth"
            @event-click="handleEventClick"
          />
        </template>
      </div>
    </div>

    <p
      v-if="cellEvents.length > MAX_VISIBLE_EVENTS"
      :class="cn('h-4.5 px-1.5 text-xs font-semibold text-muted-foreground', !cell.currentMonth && 'opacity-50')"
    >
      <span class="sm:hidden">+{{ cellEvents.length - MAX_VISIBLE_EVENTS }}</span>
      <span class="hidden sm:inline"> {{ cellEvents.length - MAX_VISIBLE_EVENTS }} more...</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isToday, startOfDay } from "date-fns";
import EventBullet from "./EventBullet.vue";
import MonthEventBadge from "./MonthEventBadge.vue";
import { cn } from "@/lib/utils";
import { getMonthCellEvents } from "@/calendar/helpers";
import type { ICalendarCell, IEvent } from "@/calendar/interfaces";

interface Props {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  eventClick: [event: IEvent];
}>();

const MAX_VISIBLE_EVENTS = 3;

const cellEvents = computed(() => getMonthCellEvents(props.cell.date, props.events, props.eventPositions));

const isSunday = computed(() => props.cell.date.getDay() === 0);

const getEventAtPosition = (position: number) => {
  return cellEvents.value.find(e => e.position === position);
};

const handleEventClick = (event: IEvent) => {
  emit("eventClick", event);
};
</script>
