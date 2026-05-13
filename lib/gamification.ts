import { Session } from './types'

export type MuscleRank = 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Esmeralda' | 'Simetrico'

const RANK_THRESHOLDS: { rank: MuscleRank; volume: number }[] = [
  { rank: 'Simetrico', volume: 150_000 },
  { rank: 'Esmeralda', volume: 60_000 },
  { rank: 'Platino', volume: 20_000 },
  { rank: 'Oro', volume: 5_000 },
  { rank: 'Plata', volume: 1_000 },
  { rank: 'Bronce', volume: 0 },
]

export function getRank(volume: number): MuscleRank {
  for (const { rank, volume: threshold } of RANK_THRESHOLDS) {
    if (volume >= threshold) return rank
  }
  return 'Bronce'
}

export function getNextRankInfo(volume: number): { nextRank: MuscleRank; remaining: number; progress: number } | null {
  const sorted = [...RANK_THRESHOLDS].reverse()
  for (let i = 0; i < sorted.length - 1; i++) {
    if (volume >= sorted[i].volume && volume < sorted[i + 1].volume) {
      const from = sorted[i].volume
      const to = sorted[i + 1].volume
      return {
        nextRank: sorted[i + 1].rank,
        remaining: to - volume,
        progress: (volume - from) / (to - from),
      }
    }
  }
  return null
}

export const RANK_COLORS: Record<MuscleRank, { text: string; bg: string; border: string }> = {
  Bronce:    { text: 'text-amber-600',   bg: 'bg-amber-600/15',   border: 'border-amber-600/30' },
  Plata:     { text: 'text-gray-300',    bg: 'bg-gray-300/15',    border: 'border-gray-300/30' },
  Oro:       { text: 'text-yellow-400',  bg: 'bg-yellow-400/15',  border: 'border-yellow-400/30' },
  Platino:   { text: 'text-cyan-300',    bg: 'bg-cyan-300/15',    border: 'border-cyan-300/30' },
  Esmeralda: { text: 'text-emerald-400', bg: 'bg-emerald-400/15', border: 'border-emerald-400/30' },
  Simetrico: { text: 'text-purple-400',  bg: 'bg-purple-400/15',  border: 'border-purple-400/30' },
}

export const RANK_EMOJI: Record<MuscleRank, string> = {
  Bronce:    '🥉',
  Plata:     '🥈',
  Oro:       '🥇',
  Platino:   '💎',
  Esmeralda: '💚',
  Simetrico: '👑',
}

export interface MuscleVolume {
  muscle: string
  totalVolume: number
  rank: MuscleRank
}

export function getMuscleVolumes(sessions: Session[]): MuscleVolume[] {
  const volumeMap: Record<string, number> = {}
  for (const session of sessions) {
    for (const ex of session.exercises) {
      const muscle = ex.muscle || 'Otro'
      const vol = ex.sets.reduce((acc, s) => acc + s.reps * s.weight, 0)
      volumeMap[muscle] = (volumeMap[muscle] ?? 0) + vol
    }
  }
  return Object.entries(volumeMap)
    .map(([muscle, totalVolume]) => ({ muscle, totalVolume, rank: getRank(totalVolume) }))
    .sort((a, b) => b.totalVolume - a.totalVolume)
}

export function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0

  const DAY_MS = 86_400_000
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const trainedDates = new Set(
    sessions.map(s => {
      const d = new Date(s.endedAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  let current = today.getTime()

  // If not trained today, check if yesterday keeps the streak alive
  if (!trainedDates.has(current)) {
    if (!trainedDates.has(current - DAY_MS)) return 0
    current = current - DAY_MS
  }

  let streak = 0
  while (trainedDates.has(current)) {
    streak++
    current -= DAY_MS
  }

  return streak
}

export function getWeeklyConsistency(sessions: Session[], weeks = 8): { date: Date; trained: boolean }[] {
  const DAY_MS = 86_400_000
  const trainedDates = new Set(
    sessions.map(s => {
      const d = new Date(s.endedAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = weeks * 7
  const result: { date: Date; trained: boolean }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS)
    result.push({ date: d, trained: trainedDates.has(d.getTime()) })
  }

  return result
}
