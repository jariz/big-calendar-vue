<template>
  <div class="grid min-h-[768px] grid-rows-[auto_1fr] overflow-hidden">
    <div class="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
      <p>Weekly view is not available on smaller devices.</p>
      <p>Please switch to daily or monthly view.</p>
    </div>

    <div class="hidden grid-rows-[auto_1fr] overflow-hidden sm:grid">
      <!-- Sticky header section -->
      <div class="sticky top-0 z-20 bg-background">
        <WeekViewMultiDayEventsRow :selected-date="selectedDate" :multi-day-events="multiDayEvents" @event-click="handleEventClick" />

        <!-- Week header -->
        <div class="flex border-b border-border">
          <div class="w-18 bg-muted/30"></div>
          <div class="grid flex-1 grid-cols-7 divide-x divide-border border-l border-border">
            <span v-for="(day, index) in weekDays" :key="index" class="bg-muted/30 py-2 text-center text-xs font-medium text-muted-foreground">
              {{ formatWeekDay(day) }}
              <span class="ml-1 font-semibold text-foreground">{{ formatDay(day) }}</span>
            </span>
          </div>
        </div>
      </div>

      <ScrollArea class="min-h-0">
        <div class="flex overflow-hidden">
          <!-- Hours column -->
          <div class="relative w-18">
            <div v-for="(hour, index) in hours" :key="hour" class="relative" style="height: 96px">
              <div class="absolute -top-3 right-2 flex h-6 items-center">
                <span v-if="index !== 0" class="text-xs text-muted-foreground">
                  {{ formatHour(hour) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Week grid -->
          <div class="relative flex-1 border-l border-border">
            <div class="grid grid-cols-7 divide-x divide-border">
              <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="relative bg-background">
                <div
                  v-for="(hour, hourIndex) in hours"
                  :key="hour"
                  :class="cn('relative', !isWorkingHour(day, hour, workingHours) && 'bg-muted/30')"
                  style="height: 96px"
                >
                  <div v-if="hourIndex !== 0" class="pointer-events-none absolute inset-x-0 top-0 border-b border-border"></div>

                  <!-- Time slots for event creation -->
                  <div
                    v-for="minute in [0, 15, 30, 45]"
                    :key="minute"
                    class="absolute inset-x-0 h-[24px] cursor-pointer transition-colors hover:bg-accent/50"
                    :style="{ top: `${(minute * 24) / 15}px` }"
                    @click="handleTimeSlotClick(day, hour, minute)"
                  />

                  <div
                    v-if="hour !== hours[hours.length - 1]"
                    class="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-border/50"
                  ></div>
                </div>

                <!-- Events for this day -->
                <div v-for="(group, groupIndex) in getDayEventGroups(day)" :key="`group-${groupIndex}`">
                  <div
                    v-for="event in group"
                    :key="event.id"
                    class="absolute p-1"
                    :style="getEventStyle(event, day, groupIndex, getDayEventGroups(day).length)"
                  >
                    <EventBlock :event="event" @event-click="handleEventClick" />
                  </div>
                </div>
              </div>
            </div>

            <CalendarTimeline :first-visible-hour="earliestEventHour" :last-visible-hour="latestEventHour" />
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { startOfWeek, addDays, format, parseISO, isSameDay, areIntervalsOverlapping } from "date-fns";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventBlock from "./EventBlock.vue";
import CalendarTimeline from "./CalendarTimeline.vue";
import WeekViewMultiDayEventsRow from "./WeekViewMultiDayEventsRow.vue";
import { cn } from "@/lib/utils";
import { groupEvents, getEventBlockStyle, isWorkingHour, getVisibleHours } from "@/calendar/helpers";
import type { IEvent } from "@/calendar/interfaces";

interface Props {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  eventClick: [event: IEvent];
  timeSlotClick: [date: Date, hour: number, minute: number];
}>();

const { selectedDate, workingHours, visibleHours } = useCalendar();

const visibleHoursData = computed(() => getVisibleHours(visibleHours.value, props.singleDayEvents));
const hours = computed(() => visibleHoursData.value.hours);
const earliestEventHour = computed(() => visibleHoursData.value.earliestEventHour);
const latestEventHour = computed(() => visibleHoursData.value.latestEventHour);

const weekStart = computed(() => startOfWeek(selectedDate.value));
const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i)));

const formatWeekDay = (day: Date) => format(day, "EE");
const formatDay = (day: Date) => format(day, "d");
const formatHour = (hour: number) => format(new Date().setHours(hour, 0, 0, 0), "hh a");

const getDayEventGroups = (day: Date) => {
  const dayEvents = props.singleDayEvents.filter(event => isSameDay(parseISO(event.startDate), day) || isSameDay(parseISO(event.endDate), day));
  return groupEvents(dayEvents);
};

const getEventStyle = (event: IEvent, day: Date, groupIndex: number, groupSize: number) => {
  let style = getEventBlockStyle(event, day, groupIndex, groupSize, { from: earliestEventHour.value, to: latestEventHour.value });

  // Check for overlaps with other groups
  const allGroups = getDayEventGroups(day);
  const hasOverlap = allGroups.some(
    (otherGroup, otherIndex) =>
      otherIndex !== groupIndex &&
      otherGroup.some(otherEvent =>
        areIntervalsOverlapping(
          { start: parseISO(event.startDate), end: parseISO(event.endDate) },
          { start: parseISO(otherEvent.startDate), end: parseISO(otherEvent.endDate) }
        )
      )
  );

  if (!hasOverlap) {
    style = { ...style, width: "100%", left: "0%" };
  }

  return style;
};

const handleEventClick = (event: IEvent) => {
  emit("eventClick", event);
};

const handleTimeSlotClick = (date: Date, hour: number, minute: number) => {
  emit("timeSlotClick", date, hour, minute);
};
</script>
