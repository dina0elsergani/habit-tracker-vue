<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="iconBg"
        >
          <component :is="icon" :class="['w-6 h-6', iconColor]" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </div>
        <div v-if="change" :class="[
          'text-sm font-medium',
          change.type === 'positive' ? 'text-green-600' : 'text-red-600'
        ]">
          {{ change.value }}
        </div>
      </div>
    </div>
    <div v-if="progress" class="mt-4">
      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Progress</span>
        <span>{{ progress.percentage }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="progressColor"
          :style="{ width: `${Math.min(progress.percentage, 100)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle: string
  value: string | number
  icon: any
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  change?: {
    type: 'positive' | 'negative'
    value: string
  }
  progress?: {
    percentage: number
  }
}>()

const colorClasses = {
  primary: {
    iconBg: 'bg-primary-100 dark:bg-primary-900',
    iconColor: 'text-primary-600 dark:text-primary-400',
    progressColor: 'bg-primary-600'
  },
  secondary: {
    iconBg: 'bg-secondary-100 dark:bg-secondary-900',
    iconColor: 'text-secondary-600 dark:text-secondary-400',
    progressColor: 'bg-secondary-600'
  },
  accent: {
    iconBg: 'bg-accent-100 dark:bg-accent-900',
    iconColor: 'text-accent-600 dark:text-accent-400',
    progressColor: 'bg-accent-600'
  },
  success: {
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400',
    progressColor: 'bg-green-600'
  },
  warning: {
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    progressColor: 'bg-yellow-600'
  },
  error: {
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-600 dark:text-red-400',
    progressColor: 'bg-red-600'
  }
}

const iconBg = computed(() => colorClasses[props.color].iconBg)
const iconColor = computed(() => colorClasses[props.color].iconColor)
const progressColor = computed(() => colorClasses[props.color].progressColor)
</script>