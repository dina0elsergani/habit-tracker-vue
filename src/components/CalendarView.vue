<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Calendar View
      </h3>
      <div class="flex space-x-2">
        <button
          @click="previousMonth"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
        <span class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ format(currentMonth, 'MMMM yyyy') }}
        </span>
        <button
          @click="nextMonth"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in dayNames"
        :key="day"
        class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="day in calendarDays"
        :key="day.date"
        :class="[
          'relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 p-1',
          day.isCurrentMonth 
            ? 'bg-white dark:bg-gray-800' 
            : 'bg-gray-50 dark:bg-gray-900',
          day.isToday && 'ring-2 ring-primary-500'
        ]"
      >
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {{ day.dayNumber }}
        </div>
        <div class="space-y-0.5">
          <div
            v-for="completion in day.completions"
            :key="completion.habitId"
            :class="[
              'w-2 h-2 rounded-full',
              completion.completed ? 'opacity-100' : 'opacity-30'
            ]"
            :style="{ backgroundColor: completion.color }"
            :title="completion.title"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useHabitStore } from '../stores/habitStore'

const habitStore = useHabitStore()
const currentMonth = ref(new Date())

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentMonth.value)
  const monthEnd = endOfMonth(currentMonth.value)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const completions = habitStore.habits.map(habit => ({
      habitId: habit.id,
      title: habit.title,
      color: habit.color,
      completed: habitStore.isHabitCompletedOnDate(habit.id, dateStr)
    })).filter(c => c.completed || isSameMonth(day, currentMonth.value))

    return {
      date: dateStr,
      dayNumber: format(day, 'd'),
      isCurrentMonth: isSameMonth(day, currentMonth.value),
      isToday: isToday(day),
      completions
    }
  })
})

const previousMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1)
}
</script>