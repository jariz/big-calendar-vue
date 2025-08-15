<template>
  <div :class="eventBadgeClasses" @click="handleClick">
    <div class="flex items-center gap-1.5 truncate">
      <svg v-if="shouldShowDot" width="8" height="8" viewBox="0 0 8 8" class="event-dot shrink-0">
        <circle cx="4" cy="4" r="4" />
      </svg>
      <span class="truncate font-medium">{{ event.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { cva } from "class-variance-authority";
import { useCalendar } from "@/calendar/contexts/calendar-context";
import { cn } from "@/lib/utils";
import type { IEvent } from "@/calendar/interfaces";
import type { VariantProps } from "class-variance-authority";

interface Props {
  event: IEvent;
  className?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  eventClick: [event: IEvent];
}>();

const { badgeVariant } = useCalendar();

const dayEventBadgeVariants = cva(
  "flex h-7 select-none items-center gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer hover:shadow-sm transition-all duration-200",
  {
    variants: {
      color: {
        // Colored and mixed variants
        blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
        green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300 [&_.event-dot]:fill-green-600",
        red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
        yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 [&_.event-dot]:fill-yellow-600",
        purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
        orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
        gray: "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [&_.event-dot]:fill-neutral-600",

        // Dot variants
        "blue-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-blue-600",
        "green-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-green-600",
        "red-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-red-600",
        "orange-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-orange-600",
        "purple-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-purple-600",
        "yellow-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-yellow-600",
        "gray-dot": "bg-neutral-50 dark:bg-neutral-900 border-border text-foreground [&_.event-dot]:fill-neutral-600",
      },
    },
    defaultVariants: {
      color: "blue-dot",
    },
  }
);

const color = computed(
  () => (badgeVariant.value === "dot" ? `${props.event.color}-dot` : props.event.color) as VariantProps<typeof dayEventBadgeVariants>["color"]
);

const eventBadgeClasses = computed(() => cn(dayEventBadgeVariants({ color: color.value }), props.className));

const shouldShowDot = computed(() => ["mixed", "dot"].includes(badgeVariant.value));

const handleClick = () => {
  emit("eventClick", props.event);
};
</script>
