<template>
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Build Better
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
          Habits
        </span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Track your daily habits, visualize your progress, and build the life you want, one day at a time.
      </p>
      <router-link
        to="/dashboard"
        class="inline-flex items-center px-6 py-3 btn-primary text-lg rounded-xl hover:scale-105 transition-transform duration-200"
      >
        Get Started
        <ArrowRightIcon class="ml-2 w-5 h-5" />
      </router-link>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatsCard
        title="Total Habits"
        subtitle="Active tracking"
        :value="overallStats.totalHabits"
        :icon="RectangleStackIcon"
        color="primary"
      />
      <StatsCard
        title="Completions"
        subtitle="All time"
        :value="overallStats.totalCompletions"
        :icon="CheckCircleIcon"
        color="success"
      />
      <StatsCard
        title="Today's Progress"
        subtitle="Habits completed"
        :value="`${overallStats.activeHabits}/${overallStats.totalHabits}`"
        :icon="ChartBarIcon"
        color="accent"
        :progress="{ percentage: overallStats.completionRate }"
      />
    </div>

    <!-- Features Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200">
        <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <CalendarDaysIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Visual Tracking
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          See your progress with beautiful calendar views and streak counters.
        </p>
      </div>

      <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-secondary-300 dark:hover:border-secondary-600 transition-colors duration-200">
        <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Smart Analytics
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Get insights with completion rates, streaks, and motivational stats.
        </p>
      </div>

      <div class="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-600 transition-colors duration-200">
        <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <CogIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Flexible Goals
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Set daily or weekly goals that work with your lifestyle and schedule.
        </p>
      </div>
    </div>

    <!-- Recent Habits -->
    <div v-if="recentHabits.length > 0" class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Habits
        </h2>
        <router-link
          to="/dashboard"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          View All
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HabitCard
          v-for="habit in recentHabits"
          :key="habit.id"
          :habit="habit"
          @edit="editHabit"
          @delete="deleteHabit"
        />
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Ready to start your journey?
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Create your first habit and begin building the life you want.
      </p>
      <button
        @click="showHabitForm = true"
        class="btn-primary text-lg px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-200"
      >
        Create Your First Habit
      </button>
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
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CogIcon,
  RectangleStackIcon
} from '@heroicons/vue/24/outline'
import { useHabitStore } from '../stores/habitStore'
import HabitCard from '../components/HabitCard.vue'
import HabitForm from '../components/HabitForm.vue'
import StatsCard from '../components/StatsCard.vue'
import type { Habit } from '../types'

const habitStore = useHabitStore()
const showHabitForm = ref(false)
const editingHabit = ref<Habit | undefined>()

const overallStats = computed(() => habitStore.overallStats)
const recentHabits = computed(() => habitStore.habits.slice(-3))

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