<template>
  <div class="grid min-h-[768px] grid-cols-[1fr_280px] overflow-hidden">
    <!-- Main day view -->
    <div class="grid grid-rows-[auto_1fr] overflow-hidden">
      <!-- Sticky day header -->
      <div class="sticky top-0 z-20 bg-background">
        <div class="flex border-b border-border bg-muted/30">
          <div class="w-18 border-r border-border"></div>
          <div class="flex-1 py-3 text-center">
            <div class="text-sm font-medium text-muted-foreground">
              {{ formatWeekDay(selectedDate) }}
            </div>
            <div
              :class="
                cn(
                  'text-lg font-semibold',
                  isToday(selectedDate) &&
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'
                )
              "
            >
              {{ formatDay(selectedDate) }}
            </div>
          </div>
        </div>

        <!-- All-day events row -->
        <div
          v-if="allDayEvents.length > 0"
          class="flex border-b border-border bg-background"
        >
          <div class="w-18 border-r border-border py-2 text-center">
            <span class="text-xs text-muted-foreground">All day</span>
          </div>
          <div class="flex-1 space-y-1 p-2">
            <div
              v-for="event in allDayEvents"
              :key="event.id"
              class="cursor-pointer"
              @click="handleEventClick(event)"
            >
              <DayEventBadge :event="event" />
            </div>
          </div>
        </div>
      </div>

      <!-- Time slots -->
      <ScrollArea class="min-h-0">
        <div class="flex">
          <!-- Hours column -->
          <div class="w-18 border-r border-border">
            <div
              v-for="(hour, index) in hours"
              :key="hour"
              class="relative border-b border-border"
              style="height: 96px"
            >
              <div
                v-if="index !== 0"
                class="absolute -top-3 right-2 flex h-6 items-center"
              >
                <span class="text-xs text-muted-foreground">
                  {{ formatHour(hour) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Day column -->
          <div class="relative flex-1">
            <!-- Hour grid lines -->
            <div
              v-for="hour in hours"
              :key="hour"
              :class="
                cn(
                  'relative border-b border-border',
                  !isWorkingHour(selectedDate, hour, workingHours) &&
                    'bg-muted/30'
                )
              "
              style="height: 96px"
            >
              <!-- Half hour line -->
              <div
                v-if="hour !== hours[hours.length - 1]"
                class="absolute inset-x-0 top-1/2 border-b border-dashed border-border/50"
              ></div>

              <!-- Time slot click areas -->
              <div
                v-for="minute in [0, 15, 30, 45]"
                :key="minute"
                class="absolute inset-x-0 h-[24px] cursor-pointer transition-colors hover:bg-accent/30"
                :style="{ top: `${(minute * 24) / 15}px` }"
                @click="handleTimeSlotClick(selectedDate, hour, minute)"
              />
            </div>

            <!-- Events -->
            <div
              v-for="(group, groupIndex) in eventGroups"
              :key="`group-${groupIndex}`"
            >
              <div
                v-for="event in group"
                :key="event.id"
                class="absolute w-full p-1"
                :style="getEventStyle(event, groupIndex, eventGroups.length)"
              >
                <DayEventBlock :event="event" @event-click="handleEventClick" />
              </div>
            </div>

            <!-- Current time indicator -->
            <CalendarTimeline
              v-if="isToday(selectedDate)"
              :first-visible-hour="earliestEventHour"
              :last-visible-hour="latestEventHour"
            />
          </div>
        </div>
      </ScrollArea>
    </div>

    <!-- Date picker sidebar -->
    <div class="border-l border-border bg-background p-4">
      <div class="mb-4">
        <!-- @vue-expect-error https://github.com/heroui-inc/heroui/issues/4154#issuecomment-2505243155 -->
        <Calendar
          class="rounded-md border border-border"
          mode="single"
          :model-value="selectedCalendarDate"
          @update:model-value="handleDateChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  format,
  isToday,
  isSameDay,
  parseISO,
  areIntervalsOverlapping,
} from "date-fns";
import { CalendarDate } from "@internationalized/date";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import DayEventBadge from "./DayEventBadge.vue";
import DayEventBlock from "./DayEventBlock.vue";
import CalendarTimeline from "../week-view/CalendarTimeline.vue";
import { cn } from "@/lib/utils";
import {
  groupEvents,
  getEventBlockStyle,
  isWorkingHour,
  getVisibleHours,
} from "@/calendar/helpers";
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

const { selectedDate, workingHours, visibleHours, setSelectedDate } =
  useCalendar();

// Convert Date to CalendarDate for the calendar component
const selectedCalendarDate = computed(() => {
  const date = selectedDate.value;
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
});

// Handle date selection from calendar component
const handleDateChange = (calendarDate: CalendarDate | undefined) => {
  if (calendarDate) {
    const newDate = new Date(
      calendarDate.year,
      calendarDate.month - 1,
      calendarDate.day
    );
    setSelectedDate(newDate);
  }
};

// Get events for the selected day
const dayEvents = computed(() =>
  props.singleDayEvents.filter(
    (event) =>
      isSameDay(parseISO(event.startDate), selectedDate.value) ||
      isSameDay(parseISO(event.endDate), selectedDate.value)
  )
);

const allDayEvents = computed(() =>
  props.multiDayEvents.filter(
    (event) =>
      isSameDay(parseISO(event.startDate), selectedDate.value) ||
      isSameDay(parseISO(event.endDate), selectedDate.value) ||
      (parseISO(event.startDate) < selectedDate.value &&
        parseISO(event.endDate) > selectedDate.value)
  )
);

// Time calculations
const visibleHoursData = computed(() =>
  getVisibleHours(visibleHours.value, dayEvents.value)
);
const hours = computed(() => visibleHoursData.value.hours);
const earliestEventHour = computed(
  () => visibleHoursData.value.earliestEventHour
);
const latestEventHour = computed(() => visibleHoursData.value.latestEventHour);

// Group events to handle overlaps
const eventGroups = computed(() => groupEvents(dayEvents.value));

// Formatting functions
const formatWeekDay = (day: Date) => format(day, "EEEE");
const formatDay = (day: Date) => format(day, "d");
const formatHour = (hour: number) =>
  format(new Date().setHours(hour, 0, 0, 0), "h a");

const getEventStyle = (
  event: IEvent,
  groupIndex: number,
  groupSize: number
) => {
  let style = getEventBlockStyle(
    event,
    selectedDate.value,
    groupIndex,
    groupSize,
    { from: earliestEventHour.value, to: latestEventHour.value }
  );

  // For day view, we can use full width if there are no overlaps
  const hasOverlap = eventGroups.value.some(
    (otherGroup, otherIndex) =>
      otherIndex !== groupIndex &&
      otherGroup.some((otherEvent) =>
        areIntervalsOverlapping(
          { start: parseISO(event.startDate), end: parseISO(event.endDate) },
          {
            start: parseISO(otherEvent.startDate),
            end: parseISO(otherEvent.endDate),
          }
        )
      )
  );

  if (!hasOverlap) {
    style = { ...style, width: "calc(100% - 8px)", left: "4px" };
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
