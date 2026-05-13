'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronRight, History } from 'lucide-react'
import { getWorkouts } from '@/lib/storage'
import { Workout } from '@/lib/types'
import { DAY_NAMES, DAY_FULL } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const today = new Date().getDay()

  useEffect(() => {
    setWorkouts(getWorkouts())
  }, [])

  function workoutForDay(day: number): Workout | null {
    return workouts.find(w => w.days.includes(day)) ?? null
  }

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      <div className="flex items-center justify-between px-5 pt-14 pb-6">
        <h1 className="text-2xl font-black tracking-tight">GRIND</h1>
        <button onClick={() => router.push('/history')} className="text-[#888] hover:text-white transition-colors">
          <History size={22} />
        </button>
      </div>

      <div className="flex-1 px-4 space-y-2 pb-24">
        {DAY_FULL.map((_name, day) => {
          const workout = workoutForDay(day)
          const isToday = day === today

          return (
            <button
              key={day}
              onClick={() => workout ? router.push(`/workout/${workout.id}`) : router.push('/routine')}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all active:scale-[0.98] ${
                isToday
                  ? 'bg-white text-black border-white'
                  : workout
                    ? 'bg-[#111] border-[#222] hover:border-[#444]'
                    : 'bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333]'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`font-mono text-xs w-7 ${isToday ? 'text-black/50' : 'text-[#555]'}`}>
                  {DAY_NAMES[day].toUpperCase()}
                </span>
                <div className="text-left">
                  {workout ? (
                    <>
                      <p className={`font-bold text-base leading-tight ${isToday ? 'text-black' : ''}`}>{workout.name}</p>
                      <p className={`text-xs mt-0.5 ${isToday ? 'text-black/50' : 'text-[#555]'}`}>
                        {workout.exercises.length} ejercicios
                      </p>
                    </>
                  ) : (
                    <p className="text-[#444] text-sm">Sin entreno</p>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className={isToday ? 'text-black/30' : 'text-[#333]'} />
            </button>
          )
        })}
      </div>

      <button
        onClick={() => router.push('/routine')}
        className="fixed bottom-8 right-6 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-[#eee] transition-colors active:scale-95"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  )
}
