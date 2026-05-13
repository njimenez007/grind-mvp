'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveSession } from '@/lib/storage'
import { Session, CompletedExercise, ActiveExercise } from '@/lib/types'
import { formatTime } from '@/lib/utils'

interface PendingSession {
  id: string
  workoutId: string
  workoutName: string
  startedAt: number
  elapsed: number
  exercises: ActiveExercise[]
}

export default function CompletePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_session')
    if (!raw) { router.push('/'); return }
    const pending: PendingSession = JSON.parse(raw)

    const completedExercises: CompletedExercise[] = pending.exercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      muscle: ex.muscle,
      sets: ex.sets
        .filter(s => s.completed)
        .map(s => ({
          reps: Number(s.reps) || 0,
          weight: Number(s.weight) || 0,
          completedAt: s.completedAt ?? Date.now(),
        })),
    })).filter(ex => ex.sets.length > 0)

    const totalSets = completedExercises.reduce((acc, ex) => acc + ex.sets.length, 0)
    const totalVolume = completedExercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((a, s) => a + s.reps * s.weight, 0),
      0
    )

    const built: Session = {
      id: pending.id,
      workoutId: pending.workoutId,
      workoutName: pending.workoutName,
      startedAt: pending.startedAt,
      endedAt: Date.now(),
      durationSeconds: pending.elapsed,
      exercises: completedExercises,
      totalSets,
      totalVolume,
    }
    setSession(built)
  }, [router])

  function handleSave() {
    if (!session || saved) return
    saveSession(session)
    setSaved(true)
    sessionStorage.removeItem('pending_session')
  }

  if (!session) return null

  return (
    <div className="flex flex-col min-h-dvh bg-black px-5 pt-16 pb-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-[#555] text-xs tracking-widest uppercase mb-3">Entreno completado</p>
        <h1 className="text-4xl font-black tracking-tight mb-2">{session.workoutName}</h1>

        {/* Time — big */}
        <p className="font-mono text-6xl font-bold tabular-nums mt-8 mb-10">
          {formatTime(session.durationSeconds)}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-10">
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
            <p className="font-mono text-2xl font-bold">{session.exercises.length}</p>
            <p className="text-[#555] text-xs mt-1">ejercicios</p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
            <p className="font-mono text-2xl font-bold">{session.totalSets}</p>
            <p className="text-[#555] text-xs mt-1">series</p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
            <p className="font-mono text-2xl font-bold">{session.totalVolume.toLocaleString()}</p>
            <p className="text-[#555] text-xs mt-1">kg volumen</p>
          </div>
        </div>

        {/* Exercise breakdown */}
        <div className="w-full space-y-2">
          {session.exercises.map(ex => (
            <div key={ex.exerciseId} className="flex items-center justify-between px-4 py-3 bg-[#111] border border-[#1a1a1a] rounded-xl">
              <div className="text-left">
                <p className="font-medium text-sm">{ex.name}</p>
                <p className="text-[#555] text-xs">{ex.muscle}</p>
              </div>
              <span className="font-mono text-xs text-[#666]">{ex.sets.length} series</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full h-14 font-bold text-base rounded-xl tracking-wide transition-all active:scale-[0.98] ${
            saved
              ? 'bg-[#1a1a1a] text-[#555] border border-[#222]'
              : 'bg-white text-black hover:bg-[#eee]'
          }`}
        >
          {saved ? 'Guardado ✓' : 'Guardar sesión'}
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full h-12 text-[#888] font-medium text-sm hover:text-white transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
