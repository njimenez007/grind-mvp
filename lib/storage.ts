import { Workout, Exercise, Session, PostWorkoutNote, BodyStat, AnkleTest, Goal, NotificationSettings } from './types'
import { defaultWorkouts } from './defaultData'

export function getWorkoutExercises(workout: Workout): Exercise[] {
  if (workout.blocks?.length) {
    return workout.blocks.flatMap(block =>
      block.exercises.map(rex => ({
        id: rex.id,
        name: rex.variantName ? `${rex.exerciseName} — ${rex.variantName}` : rex.exerciseName,
        muscle: rex.muscle,
        restSeconds: rex.restSeconds,
        sets: Array.from({ length: rex.sets }, () => ({
          reps: rex.reps,
          weight: rex.weightType === 'bodyweight' ? 0 : rex.defaultWeight,
        })),
      }))
    )
  }
  return workout.exercises ?? []
}

const WORKOUTS_KEY = 'grind_workouts'
const SESSIONS_KEY = 'grind_sessions'
const POST_WORKOUT_KEY = 'grind_post_workout_notes'
const BODY_STATS_KEY = 'grind_body_stats'
const ANKLE_TESTS_KEY = 'grind_ankle_tests'
const GOALS_KEY = 'grind_goals'
const NOTIFICATIONS_KEY = 'grind_notifications'

// ── Workouts ────────────────────────────────────────────

export function getWorkouts(): Workout[] {
  if (typeof window === 'undefined') return defaultWorkouts
  const raw = localStorage.getItem(WORKOUTS_KEY)
  if (!raw) {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(defaultWorkouts))
    return defaultWorkouts
  }
  return JSON.parse(raw)
}

export function saveWorkouts(workouts: Workout[]): void {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts))
}

export function getWorkoutById(id: string): Workout | null {
  return getWorkouts().find(w => w.id === id) ?? null
}

// ── Sessions ────────────────────────────────────────────

export function getSessions(): Session[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(SESSIONS_KEY)
  if (!raw) return []
  return JSON.parse(raw)
}

export function saveSession(session: Session): void {
  const sessions = getSessions()
  sessions.unshift(session)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function getSessionById(id: string): Session | null {
  return getSessions().find(s => s.id === id) ?? null
}

// ── Post-workout notes ───────────────────────────────────

export function getPostWorkoutNote(sessionId: string): PostWorkoutNote | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(POST_WORKOUT_KEY)
  if (!raw) return null
  const notes: PostWorkoutNote[] = JSON.parse(raw)
  return notes.find(n => n.sessionId === sessionId) ?? null
}

export function savePostWorkoutNote(note: PostWorkoutNote): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(POST_WORKOUT_KEY)
  const notes: PostWorkoutNote[] = raw ? JSON.parse(raw) : []
  const idx = notes.findIndex(n => n.sessionId === note.sessionId)
  if (idx >= 0) notes[idx] = note
  else notes.unshift(note)
  localStorage.setItem(POST_WORKOUT_KEY, JSON.stringify(notes))
}

// ── Body stats ───────────────────────────────────────────

export function getBodyStats(): BodyStat[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(BODY_STATS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveBodyStat(stat: BodyStat): void {
  const stats = getBodyStats()
  const idx = stats.findIndex(s => s.id === stat.id)
  if (idx >= 0) stats[idx] = stat
  else stats.unshift(stat)
  localStorage.setItem(BODY_STATS_KEY, JSON.stringify(stats))
}

export function deleteBodyStat(id: string): void {
  const stats = getBodyStats().filter(s => s.id !== id)
  localStorage.setItem(BODY_STATS_KEY, JSON.stringify(stats))
}

// ── Ankle tests ──────────────────────────────────────────

export function getAnkleTests(): AnkleTest[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(ANKLE_TESTS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveAnkleTest(test: AnkleTest): void {
  const tests = getAnkleTests()
  tests.unshift(test)
  localStorage.setItem(ANKLE_TESTS_KEY, JSON.stringify(tests))
}

export function deleteAnkleTest(id: string): void {
  const tests = getAnkleTests().filter(t => t.id !== id)
  localStorage.setItem(ANKLE_TESTS_KEY, JSON.stringify(tests))
}

// ── Goals ────────────────────────────────────────────────

export function getGoals(): Goal[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(GOALS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveGoal(goal: Goal): void {
  const goals = getGoals()
  const idx = goals.findIndex(g => g.id === goal.id)
  if (idx >= 0) goals[idx] = goal
  else goals.unshift(goal)
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

export function deleteGoal(id: string): void {
  const goals = getGoals().filter(g => g.id !== id)
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

// ── Notification settings ────────────────────────────────

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  reminderEnabled: false,
  reminderTime: '07:00',
  streakAlerts: true,
  rankAlerts: true,
}

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS
  const raw = localStorage.getItem(NOTIFICATIONS_KEY)
  return raw ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(raw) } : DEFAULT_NOTIFICATIONS
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(settings))
}
