'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Flame, Bell, Play } from 'lucide-react'
import { getWorkouts, getSessions } from '@/lib/storage'
import { Workout } from '@/lib/types'
import { DAY_NAMES, DAY_FULL } from '@/lib/utils'
import { calculateStreak } from '@/lib/gamification'
import BottomNav from '@/components/BottomNav'
import { GrindLogo } from '@/components/GrindLogo'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Buenos días'
  if (h >= 12 && h < 19) return 'Buenas tardes'
  return 'Buenas noches'
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
  const greeting = getGreeting()

  function workoutForDay(day: number): Workout | null {
    return workouts.find(w => w.days.includes(day)) ?? null
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#0A0A0A]">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-6">
        <div className="flex items-center gap-2.5">
          <GrindLogo size={26} />
          <span className="text-sm font-bold tracking-[0.35em] uppercase text-white">GRIND</span>
        </div>
        <button
          onClick={() => router.push('/notifications')}
          className="text-[#555] hover:text-white transition-colors p-1"
        >
          <Bell size={19} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-36">

        {/* Greeting */}
        <div className="px-5 mb-8">
          <p className="text-[#8A8A8A] text-[11px] uppercase tracking-[0.18em] font-medium">
            {greeting} · {DAY_FULL[today]}
          </p>
        </div>

        {/* Hero motivacional */}
        <div className="px-5 mb-8">
          <h2 className="text-[2.6rem] font-black uppercase leading-[1.0] tracking-tight">
            MENOS<br />EXCUSAS.<br />MÁS<br />CONSTANCIA.
          </h2>
          <p className="text-[#8A8A8A] text-[10px] uppercase tracking-[0.20em] font-semibold mt-4">
            NO ES TALENTO. ES DISCIPLINA DIARIA.
          </p>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="px-5 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/[0.04]">
              <Flame size={13} className="text-[#8A8A8A]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#DEDEDE]">
                {streak} DÍA{streak !== 1 ? 'S' : ''} CONSECUTIVO{streak !== 1 ? 'S' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Today's workout */}
        <div className="px-5 mb-6">
          {todayWorkout ? (
            <>
              <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.20em] text-[#8A8A8A] mb-2">HOY</p>
                <h3 className="text-2xl font-black tracking-tight">{todayWorkout.name}</h3>
                <p className="text-[#8A8A8A] text-[11px] uppercase tracking-[0.12em] mt-1.5">
                  {todayWorkout.exercises.length} EJERCICIOS ·{' '}
                  ~{Math.round(todayWorkout.exercises.reduce((a, ex) => a + ex.sets.length, 0) * 2.5)} MIN
                </p>
              </div>
              <button
                onClick={() => router.push(`/workout/${todayWorkout.id}`)}
                className="w-full h-14 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-[0.08em] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
              >
                <Play size={13} fill="black" strokeWidth={0} />
                INICIAR ENTRENAMIENTO
              </button>
            </>
          ) : (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.20em] text-[#8A8A8A] mb-2">HOY</p>
              <p className="font-semibold text-[#DEDEDE]">Día de descanso</p>
              <p className="text-[#555] text-[11px] uppercase tracking-[0.12em] mt-1.5">
                Recupera y vuelve más fuerte.
              </p>
            </div>
          )}
        </div>

        {/* Week calendar */}
        <div className="px-5">
          <p className="text-[10px] uppercase tracking-[0.20em] text-[#555] font-semibold mb-3">
            ESTA SEMANA
          </p>
          <div className="space-y-1">
            {DAY_FULL.map((_name, day) => {
              const workout = workoutForDay(day)
              const isToday = day === today

              return (
                <button
                  key={day}
                  onClick={() => workout ? router.push(`/workout/${workout.id}`) : router.push('/routine')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                    isToday
                      ? 'bg-white/[0.05] border-white/[0.14]'
                      : 'border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-[10px] w-7 uppercase tracking-wider ${
                      isToday ? 'text-white font-bold' : 'text-[#555]'
                    }`}>
                      {DAY_NAMES[day]}
                    </span>
                    {workout ? (
                      <p className={`font-medium text-sm ${isToday ? 'text-white' : 'text-[#8A8A8A]'}`}>
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

      </div>

      <BottomNav />
    </div>
  )
}
