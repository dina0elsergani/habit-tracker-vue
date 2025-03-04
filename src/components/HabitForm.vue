<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md animate-slide-up">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Habit' : 'Create New Habit' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Drink 8 glasses of water"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="input-field resize-none"
            placeholder="Optional description..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequency
          </label>
          <select v-model="form.frequency" class="input-field">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div v-if="form.frequency === 'weekly'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal (times per week)
          </label>
          <input
            v-model.number="form.goal"
            type="number"
            min="1"
            max="7"
            required
            class="input-field"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div class="flex space-x-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              @click="form.color = color"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-all duration-200',
                form.color === color 
                  ? 'border-gray-900 dark:border-white scale-110' 
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 btn-primary"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { Habit } from '../types'
import { useHabitStore } from '../stores/habitStore'

const props = defineProps<{
  habit?: Habit
}>()

const emit = defineEmits<{
  close: []
}>()

const habitStore = useHabitStore()

const colors = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

const form = reactive({
  title: '',
  description: '',
  frequency: 'daily' as 'daily' | 'weekly',
  goal: 3,
  color: colors[0]
})

const isEditing = !!props.habit

// Initialize form with habit data if editing
if (props.habit) {
  Object.assign(form, {
    title: props.habit.title,
    description: props.habit.description,
    frequency: props.habit.frequency,
    goal: props.habit.goal,
    color: props.habit.color
  })
}

// Reset goal when frequency changes
watch(() => form.frequency, (newFreq) => {
  if (newFreq === 'daily') {
    form.goal = 1
  } else {
    form.goal = 3
  }
})

const handleSubmit = () => {
  if (isEditing && props.habit) {
    habitStore.updateHabit(props.habit.id, {
      ...form,
      goal: form.frequency === 'daily' ? 1 : form.goal
    })
  } else {
    habitStore.addHabit({
      ...form,
      goal: form.frequency === 'daily' ? 1 : form.goal
    })
  }
  emit('close')
}
</script>