<template>
  <div class="card hover:scale-105 transition-transform duration-200">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div 
          class="w-4 h-4 rounded-full"
          :style="{ backgroundColor: habit.color }"
        ></div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ habit.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ habit.description }}
          </p>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="$emit('edit', habit)"
          class="p-2 text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <PencilIcon class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', habit.id)"
          class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>{{ habit.frequency === 'daily' ? 'Daily' : `${habit.goal}x per week` }}</span>
        <span>{{ stats.completionRate.toFixed(0) }}% complete</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :style="{ 
            width: `${Math.min(stats.completionRate, 100)}%`,
            backgroundColor: habit.color
          }"
        ></div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4 text-sm">
        <div class="flex items-center space-x-1">
          <FireIcon class="w-4 h-4 text-orange-500" />
          <span class="text-gray-600 dark:text-gray-400">{{ stats.currentStreak }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <ChartBarIcon class="w-4 h-4 text-blue-500" />
          <span class="text-gray-600 dark:text-gray-400">{{ stats.totalCompletions }}</span>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          @click="toggleToday"
          :class="[
            'p-2 rounded-lg transition-all duration-200',
            isCompletedToday
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 habit-complete-animation'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
          ]"
        >
          <CheckIcon class="w-4 h-4" />
        </button>
        <router-link
          :to="`/habit/${habit.id}`"
          class="p-2 text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <EyeIcon class="w-4 h-4" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import type { Habit } from '../types'
import { useHabitStore } from '../stores/habitStore'

const props = defineProps<{
  habit: Habit
}>()

defineEmits<{
  edit: [habit: Habit]
  delete: [id: string]
}>()

const habitStore = useHabitStore()

const today = format(new Date(), 'yyyy-MM-dd')
const isCompletedToday = computed(() => 
  habitStore.isHabitCompletedOnDate(props.habit.id, today)
)

const stats = computed(() => habitStore.getHabitStats(props.habit.id))

const toggleToday = () => {
  habitStore.toggleCompletion(props.habit.id, today)
}
</script>