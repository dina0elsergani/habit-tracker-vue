export interface Habit {
  id: string
  title: string
  description: string
  frequency: 'daily' | 'weekly'
  goal: number
  color: string
  createdAt: Date
  completions: HabitCompletion[]
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string
  completed: boolean
  notes?: string
}

export interface HabitStats {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionRate: number
  bestWeek: {
    weekStart: string
    completions: number
  }
}