<template>
  <div class="flex items-center justify-between border-b border-border bg-background px-4 py-3">
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" @click="navigatePrevious">
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" @click="navigateNext">
        <ChevronRight class="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" @click="goToToday"> Today </Button>
    </div>

    <h1 class="text-lg font-semibold">
      {{ rangeText(view, selectedDate) }}
    </h1>

    <div class="flex items-center gap-2">
      <Select v-model="currentView">
        <SelectTrigger class="w-24">
          <SelectValue placeholder="View" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="currentBadgeVariant">
        <SelectTrigger class="w-32">
          <SelectValue placeholder="Badge style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="colored">Colored</SelectItem>
          <SelectItem value="dot">Dot</SelectItem>
          <SelectItem value="mixed">Mixed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { navigateDate, rangeText } from "@/calendar/helpers";
import type { TBadgeVariant, TCalendarView } from "@/calendar/types";

const { selectedDate, view, badgeVariant, setSelectedDate, setView, setBadgeVariant } = useCalendar();

const currentView = computed({
  get: () => view.value,
  set: (value: TCalendarView) => setView(value),
});

const currentBadgeVariant = computed({
  get: () => badgeVariant.value,
  set: (value: TBadgeVariant) => setBadgeVariant(value),
});

const navigatePrevious = () => {
  const newDate = navigateDate(selectedDate.value, view.value, "previous");
  setSelectedDate(newDate);
};

const navigateNext = () => {
  const newDate = navigateDate(selectedDate.value, view.value, "next");
  setSelectedDate(newDate);
};

const goToToday = () => {
  setSelectedDate(new Date());
};
</script>
