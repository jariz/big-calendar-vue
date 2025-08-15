# Big Calendar Vue

A Vue 3 port of the [Big Calendar React component](https://github.com/lramos33/big-calendar), featuring month, week, day and year views.

## Demo

[Live Demo](https://big-calendar-vue.vercel.app/)

## Preview

![](./screenshots/Screenshot%202025-08-15%20at%2011.35.49.png)
![](./screenshots/Screenshot%202025-08-15%20at%2011.35.54.png)
![](./screenshots/Screenshot%202025-08-15%20at%2011.35.59.png)
![](./screenshots/Screenshot%202025-08-15%20at%2011.36.04.png)

<details>

<summary>Dark mode</summary>

![](./screenshots/Screenshot%202025-08-15%20at%2011.24.39.png)
![](./screenshots/Screenshot%202025-08-15%20at%2011.24.46.png)
![](./screenshots/Screenshot%202025-08-15%20at%2011.25.08.png)

</details>

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
