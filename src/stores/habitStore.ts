import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, subDays, addDays } from 'date-fns'
import type { Habit, HabitCompletion, HabitStats } from '../types'

export const useHabitStore = defineStore('habits', () => {
  const habits = ref<Habit[]>([])
  const completions = ref<HabitCompletion[]>([])

  // Load data from localStorage on store initialization
  const loadFromStorage = () => {
    const storedHabits = localStorage.getItem('habits')
    const storedCompletions = localStorage.getItem('completions')
    
    if (storedHabits) {
      habits.value = JSON.parse(storedHabits).map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt)
      }))
    }
    
    if (storedCompletions) {
      completions.value = JSON.parse(storedCompletions)
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('habits', JSON.stringify(habits.value))
    localStorage.setItem('completions', JSON.stringify(completions.value))
  }

  // Habit CRUD operations
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date(),
      completions: []
    }
    habits.value.push(newHabit)
    saveToStorage()
  }

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value[index] = { ...habits.value[index], ...updates }
      saveToStorage()
    }
  }

  const deleteHabit = (id: string) => {
    habits.value = habits.value.filter(h => h.id !== id)
    completions.value = completions.value.filter(c => c.habitId !== id)
    saveToStorage()
  }

  const getHabitById = (id: string) => {
    return habits.value.find(h => h.id === id)
  }

  // Completion operations
  const toggleCompletion = (habitId: string, date: string) => {
    const existingCompletion = completions.value.find(
      c => c.habitId === habitId && c.date === date
    )

    if (existingCompletion) {
      existingCompletion.completed = !existingCompletion.completed
    } else {
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        date,
        completed: true
      }
      completions.value.push(newCompletion)
    }
    saveToStorage()
  }

  const getCompletionsForHabit = (habitId: string) => {
    return completions.value.filter(c => c.habitId === habitId)
  }

  const isHabitCompletedOnDate = (habitId: string, date: string) => {
    const completion = completions.value.find(
      c => c.habitId === habitId && c.date === date
    )
    return completion?.completed || false
  }

  // Statistics
  const getHabitStats = (habitId: string): HabitStats => {
    const habitCompletions = getCompletionsForHabit(habitId)
      .filter(c => c.completed)
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    let checkDate = today

    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd')
      if (isHabitCompletedOnDate(habitId, dateStr)) {
        currentStreak++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    let lastDate: Date | null = null

    habitCompletions.forEach(completion => {
      const currentDate = parseISO(completion.date)
      
      if (lastDate && Math.abs(currentDate.getTime() - lastDate.getTime()) === 24 * 60 * 60 * 1000) {
        tempStreak++
      } else {
        tempStreak = 1
      }
      
      longestStreak = Math.max(longestStreak, tempStreak)
      lastDate = currentDate
    })

    // Calculate best week
    const weekCompletions = new Map<string, number>()
    habitCompletions.forEach(completion => {
      const date = parseISO(completion.date)
      const weekStart = format(startOfWeek(date), 'yyyy-MM-dd')
      weekCompletions.set(weekStart, (weekCompletions.get(weekStart) || 0) + 1)
    })

    let bestWeek = { weekStart: '', completions: 0 }
    weekCompletions.forEach((count, weekStart) => {
      if (count > bestWeek.completions) {
        bestWeek = { weekStart, completions: count }
      }
    })

    const totalCompletions = habitCompletions.length
    const habit = getHabitById(habitId)
    const daysSinceCreated = Math.ceil((Date.now() - (habit?.createdAt.getTime() || 0)) / (1000 * 60 * 60 * 24))
    const expectedCompletions = habit?.frequency === 'daily' ? daysSinceCreated : Math.ceil(daysSinceCreated / 7) * (habit?.goal || 1)
    const completionRate = expectedCompletions > 0 ? (totalCompletions / expectedCompletions) * 100 : 0

    return {
      currentStreak,
      longestStreak,
      totalCompletions,
      completionRate: Math.min(completionRate, 100),
      bestWeek
    }
  }

  // Overall statistics
  const overallStats = computed(() => {
    const totalHabits = habits.value.length
    const totalCompletions = completions.value.filter(c => c.completed).length
    const activeHabits = habits.value.filter(habit => {
      const today = format(new Date(), 'yyyy-MM-dd')
      return isHabitCompletedOnDate(habit.id, today)
    }).length

    return {
      totalHabits,
      totalCompletions,
      activeHabits,
      completionRate: totalHabits > 0 ? (activeHabits / totalHabits) * 100 : 0
    }
  })

  // Initialize store
  loadFromStorage()

  return {
    habits,
    completions,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    toggleCompletion,
    getCompletionsForHabit,
    isHabitCompletedOnDate,
    getHabitStats,
    overallStats
  }
})