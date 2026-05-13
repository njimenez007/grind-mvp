import { Workout, Session } from './types'
import { defaultWorkouts } from './defaultData'

const WORKOUTS_KEY = 'grind_workouts'
const SESSIONS_KEY = 'grind_sessions'

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
  const workouts = getWorkouts()
  return workouts.find(w => w.id === id) ?? null
}

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
  const sessions = getSessions()
  return sessions.find(s => s.id === id) ?? null
}
