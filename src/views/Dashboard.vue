<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Track your habits and monitor your progress
        </p>
      </div>
      <button
        @click="showHabitForm = true"
        class="btn-primary mt-4 md:mt-0"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Habit
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Habits"
        subtitle="Active tracking"
        :value="overallStats.totalHabits"
        :icon="RectangleStackIcon"
        color="primary"
      />
      <StatsCard
        title="Completed Today"
        subtitle="Out of total habits"
        :value="`${overallStats.activeHabits}/${overallStats.totalHabits}`"
        :icon="CheckCircleIcon"
        color="success"
        :progress="{ percentage: overallStats.completionRate }"
      />
      <StatsCard
        title="Total Completions"
        subtitle="All time"
        :value="overallStats.totalCompletions"
        :icon="ChartBarIcon"
        color="accent"
      />
      <StatsCard
        title="This Week"
        subtitle="Completion rate"
        :value="`${weeklyStats.completionRate}%`"
        :icon="CalendarDaysIcon"
        color="secondary"
        :progress="{ percentage: weeklyStats.completionRate }"
      />
    </div>

    <!-- Calendar View -->
    <div class="mb-8">
      <CalendarView />
    </div>

    <!-- Habits Grid -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Your Habits
        </h2>
        <div class="flex items-center space-x-2">
          <button
            @click="filterBy = 'all'"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200',
              filterBy === 'all'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            ]"
          >
            All
          </button>
          <button
            @click="filterBy = 'daily'"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200',
              filterBy === 'daily'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            ]"
          >
            Daily
          </button>
          <button
            @click="filterBy = 'weekly'"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200',
              filterBy === 'weekly'
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            ]"
          >
            Weekly
          </button>
        </div>
      </div>

      <div v-if="filteredHabits.length === 0" class="text-center py-12">
        <RectangleStackIcon class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No habits yet
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Get started by creating your first habit to track.
        </p>
        <button
          @click="showHabitForm = true"
          class="btn-primary"
        >
          Create Habit
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HabitCard
          v-for="habit in filteredHabits"
          :key="habit.id"
          :habit="habit"
          @edit="editHabit"
          @delete="deleteHabit"
        />
      </div>
    </div>

    <!-- Habit Form Modal -->
    <HabitForm
      v-if="showHabitForm"
      :habit="editingHabit"
      @close="closeHabitForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import {
  PlusIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  RectangleStackIcon
} from '@heroicons/vue/24/outline'
import { useHabitStore } from '../stores/habitStore'
import HabitCard from '../components/HabitCard.vue'
import HabitForm from '../components/HabitForm.vue'
import CalendarView from '../components/CalendarView.vue'
import StatsCard from '../components/StatsCard.vue'
import type { Habit } from '../types'

const habitStore = useHabitStore()
const showHabitForm = ref(false)
const editingHabit = ref<Habit | undefined>()
const filterBy = ref<'all' | 'daily' | 'weekly'>('all')

const overallStats = computed(() => habitStore.overallStats)

const filteredHabits = computed(() => {
  if (filterBy.value === 'all') return habitStore.habits
  return habitStore.habits.filter(habit => habit.frequency === filterBy.value)
})

const weeklyStats = computed(() => {
  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)
  
  const weeklyCompletions = habitStore.completions.filter(completion => {
    const completionDate = new Date(completion.date)
    return completion.completed && isWithinInterval(completionDate, { start: weekStart, end: weekEnd })
  })

  const totalExpectedCompletions = habitStore.habits.reduce((total, habit) => {
    if (habit.frequency === 'daily') {
      return total + 7 // 7 days in a week
    } else {
      return total + habit.goal
    }
  }, 0)

  const completionRate = totalExpectedCompletions > 0 
    ? Math.round((weeklyCompletions.length / totalExpectedCompletions) * 100)
    : 0

  return {
    completions: weeklyCompletions.length,
    completionRate: Math.min(completionRate, 100)
  }
})

const editHabit = (habit: Habit) => {
  editingHabit.value = habit
  showHabitForm.value = true
}

const deleteHabit = (id: string) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    habitStore.deleteHabit(id)
  }
}

const closeHabitForm = () => {
  showHabitForm.value = false
  editingHabit.value = undefined
}
</script>