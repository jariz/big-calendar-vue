<template>
  <Dialog v-model:open="isOpen">
    <DialogContent v-if="event" class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ event.title }}</DialogTitle>
        <DialogDescription> Event details </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold">Start:</span>
            <p>{{ formatDateTime(event.startDate) }}</p>
          </div>
          <div>
            <span class="font-semibold">End:</span>
            <p>{{ formatDateTime(event.endDate) }}</p>
          </div>
        </div>

        <div class="text-sm">
          <span class="font-semibold">Organizer:</span>
          <p>{{ event.user.name }}</p>
        </div>

        <div class="text-sm">
          <span class="font-semibold">Description:</span>
          <p class="text-muted-foreground">{{ event.description }}</p>
        </div>

        <div class="flex items-center gap-2 text-sm">
          <span class="font-semibold">Color:</span>
          <div :class="cn('h-4 w-4 rounded-full', getColorClass(event.color))" />
          <span class="capitalize">{{ event.color }}</span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="isOpen = false"> Close </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IEvent } from "@/calendar/interfaces";
import type { TEventColor } from "@/calendar/types";

interface Props {
  event: IEvent | null;
  open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const isOpen = ref(props.open);

watch(
  () => props.open,
  newValue => {
    isOpen.value = newValue;
  }
);

watch(isOpen, newValue => {
  emit("update:open", newValue);
});

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "MMM d, yyyy h:mm a");
};

const getColorClass = (color: TEventColor) => {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    gray: "bg-neutral-600",
  };
  return colorClasses[color];
};
</script>
