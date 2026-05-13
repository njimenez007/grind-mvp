'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Flame, Bell, Play } from 'lucide-react'
import { getWorkouts, getSessions } from '@/lib/storage'
import { Workout } from '@/lib/types'
import { DAY_NAMES, DAY_FULL } from '@/lib/utils'
import { calculateStreak } from '@/lib/gamification'
import BottomNav from '@/components/BottomNav'

const MOTIVATIONAL = [
  'El progreso, no la perfección.',
  'Cada repetición cuenta.',
  'Hoy te conviertes en quien querías ser.',
  'La consistencia gana.',
  'Sin excusas. Solo resultados.',
  'Tu cuerpo puede más de lo que tu mente cree.',
  'Un día a la vez.',
  'El esfuerzo de hoy es el resultado de mañana.',
  'No pares cuando duela. Para cuando estés listo.',
  'Sé la mejor versión de ti.',
  'Disciplina > Motivación.',
  'El silencio del trabajo duro habla más que las palabras.',
  'No hay atajos.',
  'Duele ahora, brilla después.',
  'Haz que valga la pena.',
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Buenos días'
  if (h >= 12 && h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

export default function HomePage() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [streak, setStreak] = useState(0)
  const today = new Date().getDay()

  useEffect(() => {
    const w = getWorkouts()
    const s = getSessions()
    setWorkouts(w)
    setStreak(calculateStreak(s))
  }, [])

  const todayWorkout = workouts.find(w => w.days.includes(today)) ?? null
  const quote = MOTIVATIONAL[getDayOfYear() % MOTIVATIONAL.length]
  const greeting = getGreeting()

  function workoutForDay(day: number): Workout | null {
    return workouts.find(w => w.days.includes(day)) ?? null
  }

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <h1 className="text-2xl font-black tracking-tight">GRIND</h1>
        <button
          onClick={() => router.push('/notifications')}
          className="text-[#555] hover:text-white transition-colors"
        >
          <Bell size={20} />
        </button>
      </div>

      <div className="flex-1 px-5 pb-28 overflow-y-auto">
        {/* Greeting */}
        <div className="mb-5">
          <p className="text-[#555] text-sm">
            {greeting} · {DAY_FULL[today]}
          </p>
          <p className="text-[#444] text-sm mt-1 italic">"{quote}"</p>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-2 mb-5">
            <Flame size={16} className="text-orange-400" />
            <span className="font-bold text-sm">
              {streak} día{streak !== 1 ? 's' : ''} seguido{streak !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Today's workout — hero card */}
        {todayWorkout ? (
          <button
            onClick={() => router.push(`/workout/${todayWorkout.id}`)}
            className="w-full bg-white text-black rounded-2xl p-5 mb-6 text-left active:scale-[0.98] transition-transform"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Hoy</p>
            <h2 className="text-3xl font-black tracking-tight leading-tight">{todayWorkout.name}</h2>
            <p className="text-black/50 text-sm mt-1">
              {todayWorkout.exercises.length} ejercicios ·{' '}
              ~{Math.round(todayWorkout.exercises.reduce((a, ex) => a + ex.sets.length, 0) * 2.5)} min
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Play size={14} fill="black" strokeWidth={0} />
              <span className="font-bold text-sm">Iniciar entreno</span>
            </div>
          </button>
        ) : (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#444] mb-1">Hoy</p>
            <p className="text-[#555] font-semibold">Día de descanso</p>
            <p className="text-[#333] text-xs mt-1">Recupera y vuelve más fuerte.</p>
          </div>
        )}

        {/* Week calendar */}
        <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-3">Esta semana</p>
        <div className="space-y-1.5">
          {DAY_FULL.map((_name, day) => {
            const workout = workoutForDay(day)
            const isToday = day === today

            return (
              <button
                key={day}
                onClick={() => workout ? router.push(`/workout/${workout.id}`) : router.push('/routine')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                  isToday
                    ? 'bg-[#111] border-[#333]'
                    : workout
                      ? 'bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333]'
                      : 'bg-[#0a0a0a] border-[#111] hover:border-[#222]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-[10px] w-7 ${isToday ? 'text-white font-bold' : 'text-[#444]'}`}>
                    {DAY_NAMES[day].toUpperCase()}
                  </span>
                  {workout ? (
                    <p className={`font-semibold text-sm ${isToday ? 'text-white' : 'text-[#666]'}`}>
                      {workout.name}
                    </p>
                  ) : (
                    <p className="text-[#333] text-sm">—</p>
                  )}
                </div>
                {workout && (
                  <ChevronRight size={14} className={isToday ? 'text-[#555]' : 'text-[#2a2a2a]'} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
