# Big Calendar Vue

A Vue 3 port of the Big Calendar React component, featuring month and week views with comprehensive event management.

## Features

- **Month View**: Display events in a monthly calendar grid
- **Week View**: Detailed weekly view with hourly time slots and timeline
- **Event Badges**: Colored event indicators with multiple display styles (dot, colored, mixed)
- **Event Details**: Click on events to view detailed information
- **Multi-day Events**: Support for events spanning multiple days
- **Current Time Indicator**: Live timeline showing current time in week view
- **Working Hours**: Configurable working hours with visual distinction
- **Responsive Design**: Works on desktop and mobile devices (week view hidden on mobile)
- **Modern UI**: Built with shadcn-vue components and Tailwind CSS

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Tailwind CSS
- shadcn-vue
- date-fns for date manipulation
- class-variance-authority for component variants

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Components

### Calendar Components

- `Calendar.vue` - Main calendar wrapper with context provider
- `CalendarHeader.vue` - Navigation and controls
- `CalendarMonthView.vue` - Month view grid layout
- `DayCell.vue` - Individual day cell with events
- `MonthEventBadge.vue` - Event display badge
- `EventBullet.vue` - Simple event indicator dot
- `EventDetailsDialog.vue` - Event details modal

### Event Types

Events support multiple colors (blue, green, red, yellow, purple, orange, gray) and can be single-day or multi-day events.

## Usage

```vue
<template>
  <Calendar />
</template>

<script setup lang="ts">
import Calendar from "./calendar/components/Calendar.vue";
</script>
```

The calendar automatically loads mock data for demonstration purposes. In a real application, you would replace the mock data with your actual event data source.
