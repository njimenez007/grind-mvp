'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Check, Plus } from 'lucide-react'
import { getWorkoutById } from '@/lib/storage'
import { ActiveExercise, ActiveSet } from '@/lib/types'
import { formatTime, genId } from '@/lib/utils'
import RestTimer from '@/components/RestTimer'

const REST_SECONDS = 90

export default function SessionPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState<ActiveExercise[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [restActive, setRestActive] = useState(false)
  const [restSeconds, setRestSeconds] = useState(REST_SECONDS)
  const startRef = useRef(Date.now())
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const exerciseRefs = useRef<(HTMLDivElement | null)[]>([])

  // Load workout
  useEffect(() => {
    const workout = getWorkoutById(id)
    if (!workout) { router.push('/'); return }
    setWorkoutName(workout.name)
    setExercises(
      workout.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        completed: false,
        sets: ex.sets.map(s => ({ reps: String(s.reps), weight: String(s.weight), completed: false })),
      }))
    )
  }, [id, router])

  // Workout timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])

  // Rest timer countdown
  useEffect(() => {
    if (restActive) {
      restRef.current = setInterval(() => setRestSeconds(s => Math.max(0, s - 1)), 1000)
    } else {
      if (restRef.current) clearInterval(restRef.current)
    }
    return () => { if (restRef.current) clearInterval(restRef.current) }
  }, [restActive])

  const completedCount = exercises.filter(e => e.completed).length

  function startRest() {
    setRestSeconds(REST_SECONDS)
    setRestActive(true)
  }

  const handleRestEnd = useCallback(() => {
    setRestActive(false)
  }, [])

  function completeSet(exIdx: number, setIdx: number) {
    setExercises(prev => {
      const next = prev.map((ex, ei) => {
        if (ei !== exIdx) return ex
        const sets = ex.sets.map((s, si) => si === setIdx ? { ...s, completed: true, completedAt: Date.now() } : s)
        const allDone = sets.every(s => s.completed)
        return { ...ex, sets, completed: allDone }
      })

      // Advance to next exercise if all sets done
      const ex = next[exIdx]
      if (ex.completed) {
        const nextIdx = next.findIndex((e, i) => i > exIdx && !e.completed)
        if (nextIdx !== -1) {
          setActiveIdx(nextIdx)
          setTimeout(() => {
            exerciseRefs.current[nextIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 150)
        } else {
          // All exercises done — keep activeIdx at last
          setActiveIdx(exIdx)
        }
      }

      return next
    })
    startRest()
  }

  function updateSet(exIdx: number, setIdx: number, field: 'reps' | 'weight', value: string) {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIdx) return ex
      const sets = ex.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s)
      return { ...ex, sets }
    }))
  }

  function addSet(exIdx: number) {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIdx) return ex
      const lastSet = ex.sets[ex.sets.length - 1]
      const newSet: ActiveSet = { reps: lastSet?.reps ?? '10', weight: lastSet?.weight ?? '0', completed: false }
      return { ...ex, sets: [...ex.sets, newSet] }
    }))
  }

  function finish() {
    // Build session data and pass via sessionStorage to avoid URL length limits
    const session = {
      id: genId(),
      workoutId: id,
      workoutName,
      startedAt: startRef.current,
      elapsed,
      exercises,
    }
    sessionStorage.setItem('pending_session', JSON.stringify(session))
    router.push(`/session/${id}/complete`)
  }

  const allDone = exercises.length > 0 && exercises.every(e => e.completed)

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-black border-b border-[#111] px-5 pt-12 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="font-mono text-3xl font-bold tabular-nums tracking-tight">{formatTime(elapsed)}</span>
            <p className="text-[#555] text-xs mt-0.5">{workoutName}</p>
          </div>
          <span className="font-mono text-sm text-[#555] mt-1">{completedCount}/{exercises.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-px bg-[#1a1a1a] w-full overflow-hidden rounded-full">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: exercises.length ? `${(completedCount / exercises.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="flex-1 px-4 py-4 space-y-3 pb-36">
        {exercises.map((ex, exIdx) => {
          const isActive = exIdx === activeIdx && !ex.completed
          const isDone = ex.completed
          const isPending = !isActive && !isDone

          return (
            <div
              key={ex.id}
              ref={el => { exerciseRefs.current[exIdx] = el }}
            >
              {/* Collapsed states */}
              {(isDone || isPending) && (
                <button
                  onClick={() => !isDone && setActiveIdx(exIdx)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-[#0d0d0d] border-[#1a1a1a]'
                      : 'bg-[#0a0a0a] border-[#111] hover:border-[#222]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone
                      ? <Check size={14} className="text-[#555]" />
                      : <span className="w-3.5 h-3.5 rounded-full border border-[#333]" />
                    }
                    <span className={`font-medium text-sm ${isDone ? 'text-[#555]' : 'text-[#666]'}`}>{ex.name}</span>
                  </div>
                  <span className="font-mono text-xs text-[#444]">{ex.sets.length} series</span>
                </button>
              )}

              {/* Expanded — active exercise */}
              {isActive && (
                <div className="bg-[#111] border border-white/20 rounded-xl overflow-hidden">
                  <div className="px-4 pt-4 pb-3 border-b border-[#1e1e1e]">
                    <p className="font-bold text-lg leading-tight">{ex.name}</p>
                    <p className="text-xs text-[#555] mt-0.5">{ex.muscle}</p>
                  </div>

                  <div className="px-4 py-3 space-y-2">
                    {/* Column headers */}
                    <div className="flex items-center gap-2 px-1 mb-1">
                      <span className="w-6" />
                      <span className="flex-1 text-center text-[10px] text-[#555] font-mono uppercase tracking-wider">Reps</span>
                      <span className="flex-1 text-center text-[10px] text-[#555] font-mono uppercase tracking-wider">Kg</span>
                      <span className="w-12" />
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div key={setIdx} className={`flex items-center gap-2 transition-opacity ${set.completed ? 'opacity-40' : ''}`}>
                        <span className="font-mono text-xs text-[#444] w-6 text-center">{setIdx + 1}</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={set.reps}
                          onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                          disabled={set.completed}
                          className="flex-1 h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-center font-mono text-lg font-bold focus:outline-none focus:border-white/40 disabled:pointer-events-none"
                        />
                        <input
                          type="number"
                          inputMode="decimal"
                          value={set.weight}
                          onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                          disabled={set.completed}
                          className="flex-1 h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-center font-mono text-lg font-bold focus:outline-none focus:border-white/40 disabled:pointer-events-none"
                        />
                        <button
                          onClick={() => !set.completed && completeSet(exIdx, setIdx)}
                          disabled={set.completed}
                          className={`w-12 h-11 rounded-lg border flex items-center justify-center transition-all active:scale-95 ${
                            set.completed
                              ? 'bg-white border-white text-black'
                              : 'border-[#333] text-[#555] hover:border-white hover:text-white'
                          }`}
                        >
                          <Check size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addSet(exIdx)}
                      className="w-full h-9 border border-dashed border-[#2a2a2a] rounded-lg text-xs text-[#555] hover:text-white hover:border-[#444] transition-colors flex items-center justify-center gap-1.5 mt-1"
                    >
                      <Plus size={12} /> Agregar serie
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-black border-t border-[#111]">
        <button
          onClick={finish}
          className={`w-full h-14 font-bold text-base rounded-xl tracking-wide transition-all active:scale-[0.98] ${
            allDone
              ? 'bg-white text-black'
              : 'bg-[#111] border border-[#222] text-[#888]'
          }`}
        >
          {allDone ? 'Ver resumen' : 'Finalizar entreno'}
        </button>
      </div>

      {/* Rest timer overlay */}
      {restActive && (
        <RestTimer
          seconds={restSeconds}
          total={REST_SECONDS}
          onSkip={handleRestEnd}
          onEnd={handleRestEnd}
        />
      )}
    </div>
  )
}
