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
  restSeconds?: number
}

// ── Routine block types (new system) ────────────────────────────────────────

export type WeightType = 'bodyweight' | 'kg'
export type BlockType = 'warmup' | 'main' | 'closing'

export interface RoutineExercise {
  id: string
  exerciseId: string
  exerciseName: string
  muscle: string
  selectedVariant: string   // 'A' | 'B' | 'C' | 'D'
  variantName: string
  sets: number
  reps: number
  restSeconds: number
  weightType: WeightType
  defaultWeight: number     // kg; 0 for bodyweight
}

export interface RoutineBlock {
  type: BlockType
  exercises: RoutineExercise[]
}

export interface Workout {
  id: string
  name: string
  description?: string
  muscles?: string[]
  days: number[]            // 0=Dom, 1=Lun … 6=Sáb
  blocks: RoutineBlock[]    // new format
  exercises?: Exercise[]    // legacy fallback
}

// ── Session tracking ──────────────────────────────────────────────────────────

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
  restSeconds: number
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
