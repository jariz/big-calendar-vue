<template>
  <div v-if="isCurrentHourVisible" class="pointer-events-none absolute inset-x-0 z-50 border-t border-primary" :style="{ top: `${currentTimePosition}%` }">
    <div class="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"></div>
    <div class="absolute -left-18 flex w-16 -translate-y-1/2 justify-end bg-background pr-1 text-xs font-medium text-primary">
      {{ currentTimeFormatted }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { format } from "date-fns";

interface Props {
  firstVisibleHour: number;
  lastVisibleHour: number;
}

const props = defineProps<Props>();

const currentTime = ref(new Date());
let timer: number;

const currentTimePosition = computed(() => {
  const minutes = currentTime.value.getHours() * 60 + currentTime.value.getMinutes();
  const visibleStartMinutes = props.firstVisibleHour * 60;
  const visibleEndMinutes = props.lastVisibleHour * 60;
  const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;
  return ((minutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
});

const currentTimeFormatted = computed(() => format(currentTime.value, "h:mm a"));

const isCurrentHourVisible = computed(() => {
  const currentHour = currentTime.value.getHours();
  return currentHour >= props.firstVisibleHour && currentHour < props.lastVisibleHour;
});

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 60 * 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
