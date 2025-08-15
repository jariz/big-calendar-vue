<script setup lang="ts">
import Calendar from "./calendar/components/Calendar.vue";
import { useTheme } from "./composables/useTheme";

// Initialize theme system
useTheme();
</script>

<template>
  <div class="bg-background text-foreground">
    <Calendar />
  </div>
</template>
