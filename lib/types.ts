export interface PlannedSet {
  reps: number
  weight: number
}

export interface Exercise {
  id: string
  name: string
  muscle: string
  sets: PlannedSet[]
  notes?: string
}

export interface Workout {
  id: string
  name: string
  days: number[] // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
  exercises: Exercise[]
}

export interface ActiveSet {
  reps: string
  weight: string
  completed: boolean
  completedAt?: number
}

export interface ActiveExercise {
  id: string
  name: string
  muscle: string
  sets: ActiveSet[]
  completed: boolean
}

export interface CompletedSet {
  reps: number
  weight: number
  completedAt: number
}

export interface CompletedExercise {
  exerciseId: string
  name: string
  muscle: string
  sets: CompletedSet[]
}

export interface Session {
  id: string
  workoutId: string
  workoutName: string
  startedAt: number
  endedAt: number
  durationSeconds: number
  exercises: CompletedExercise[]
  totalVolume: number
  totalSets: number
}

export interface ExerciseTemplate {
  id: string
  name: string
  muscle: string
  icon: string
  variants?: { label: string; description: string }[]
}

export interface PostWorkoutNote {
  sessionId: string
  text?: string
  photoDataUrl?: string
  voiceDataUrl?: string
  savedAt: number
}

export interface BodyStat {
  id: string
  date: string // YYYY-MM-DD
  weight?: number
  fat?: number
  muscle?: number
}

export interface AnkleTest {
  id: string
  date: string // YYYY-MM-DD
  seconds: number
  side: 'left' | 'right'
}

export interface Goal {
  id: string
  name: string
  target: number
  current: number
  unit: string
  createdAt: number
  completedAt?: number
}

export interface NotificationSettings {
  reminderEnabled: boolean
  reminderTime: string // HH:MM
  streakAlerts: boolean
  rankAlerts: boolean
}
