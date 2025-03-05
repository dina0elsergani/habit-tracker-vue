<template>
  <div v-if="habit" class="animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-3">
          <div 
            class="w-6 h-6 rounded-full"
            :style="{ backgroundColor: habit.color }"
          ></div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ habit.title }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ habit.description }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
          @click="editHabit"
          class="btn-secondary"
        >
          <PencilIcon class="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          @click="deleteHabit"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <TrashIcon class="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Current Streak"
        subtitle="Days in a row"
        :value="stats.currentStreak"
        :icon="FireIcon"
        color="accent"
      />
      <StatsCard
        title="Longest Streak"
        subtitle="Personal best"
        :value="stats.longestStreak"
        :icon="TrophyIcon"
        color="warning"
      />
      <StatsCard
        title="Total Completions"
        subtitle="All time"
        :value="stats.totalCompletions"
        :icon="CheckCircleIcon"
        color="success"
      />
      <StatsCard
        title="Completion Rate"
        subtitle="Overall progress"
        :value="`${stats.completionRate.toFixed(0)}%`"
        :icon="ChartBarIcon"
        color="primary"
        :progress="{ percentage: stats.completionRate }"
      />
    </div>

    <!-- Best Week -->
    <div v-if="stats.bestWeek.completions > 0" class="card mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
          <CalendarDaysIcon class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Best Week
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Week of {{ format(new Date(stats.bestWeek.weekStart), 'MMMM d, yyyy') }}
          </p>
        </div>
      </div>
      <div class="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
        {{ stats.bestWeek.completions }} completions
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      <div class="space-y-3">
        <div
          v-for="day in recentDays"
          :key="day.date"
          class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-3 h-3 rounded-full',
              day.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"></div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ format(new Date(day.date), 'EEEE, MMMM d') }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ day.completed ? 'Completed' : 'Not completed' }}
              </div>
            </div>
          </div>
          <button
            @click="toggleDay(day.date)"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200',
              day.completed
                ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800'
                : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800'
            ]"
          >
            {{ day.completed ? 'Undo' : 'Mark Done' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Habit Form Modal -->
    <HabitForm
      v-if="showHabitForm"
      :habit="habit"
      @close="showHabitForm = false"
    />
  </div>

  <div v-else class="text-center py-12">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Habit not found
    </h1>
    <router-link to="/dashboard" class="btn-primary">
      Back to Dashboard
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { format, subDays } from 'date-fns'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  FireIcon,
  TrophyIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import { useHabitStore } from '../stores/habitStore'
import HabitForm from '../components/HabitForm.vue'
import StatsCard from '../components/StatsCard.vue'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const habitStore = useHabitStore()
const showHabitForm = ref(false)

const habit = computed(() => habitStore.getHabitById(props.id))
const stats = computed(() => habitStore.getHabitStats(props.id))

const recentDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'yyyy-MM-dd')
    days.push({
      date: dateStr,
      completed: habitStore.isHabitCompletedOnDate(props.id, dateStr)
    })
  }
  return days
})

const toggleDay = (date: string) => {
  habitStore.toggleCompletion(props.id, date)
}

const editHabit = () => {
  showHabitForm.value = true
}

const deleteHabit = () => {
  if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
    habitStore.deleteHabit(props.id)
    router.push('/dashboard')
  }
}
</script>