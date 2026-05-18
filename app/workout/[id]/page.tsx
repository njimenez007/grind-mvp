'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Clock, Flame, Edit2 } from 'lucide-react'
import { getWorkoutById, getWorkoutExercises } from '@/lib/storage'
import { Exercise, Workout } from '@/lib/types'

export default function WorkoutDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    const w = getWorkoutById(id)
    setWorkout(w)
    if (w) setExercises(getWorkoutExercises(w))
  }, [id])

  if (!workout) return null

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const estimatedMinutes = Math.round(totalSets * 2.5)

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <button onClick={() => router.push(`/routine?edit=${id}`)} className="text-[#888] hover:text-white transition-colors">
          <Edit2 size={18} />
        </button>
      </div>

      <div className="px-5 pb-6">
        <h1 className="text-3xl font-black tracking-tight mb-2">{workout.name}</h1>
        <div className="flex items-center gap-4 text-[#888] text-sm">
          <span className="flex items-center gap-1.5">
            <Flame size={14} />
            {exercises.length} ejercicios
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            ~{estimatedMinutes} min
          </span>
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 px-4 space-y-2 pb-36">
        {exercises.map((ex, i) => (
          <div key={ex.id} className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs text-[#555]">{i + 1}</span>
                <p className="font-semibold text-sm">{ex.name}</p>
              </div>
              <p className="text-xs text-[#555] ml-5">{ex.muscle}</p>
            </div>
            <span className="font-mono text-xs text-[#555] mt-0.5">{ex.sets.length} series</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-black border-t border-[#111]">
        <button
          onClick={() => router.push(`/warmup/${id}`)}
          className="w-full h-14 bg-white text-black font-bold text-base rounded-xl tracking-wide active:scale-[0.98] transition-transform"
        >
          Iniciar calentamiento
        </button>
      </div>
    </div>
  )
}
