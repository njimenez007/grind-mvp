'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, GripVertical, Check, X, Search } from 'lucide-react'
import { getWorkouts, saveWorkouts } from '@/lib/storage'
import { Workout, Exercise } from '@/lib/types'
import { DAY_NAMES, genId } from '@/lib/utils'
import { Suspense } from 'react'
import BottomNav from '@/components/BottomNav'
import WgerPicker from '@/components/WgerPicker'

// ── Main content ─────────────────────────────────────────

function RoutineContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [editing, setEditing] = useState<Workout | null>(null)
  const [mode, setMode] = useState<'list' | 'edit'>('list')
  const [newExName, setNewExName] = useState('')
  const [newExMuscle, setNewExMuscle] = useState('')
  const [newExSets, setNewExSets] = useState('3')
  const [newExReps, setNewExReps] = useState('10')
  const [showAddEx, setShowAddEx] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  useEffect(() => {
    const loaded = getWorkouts()
    setWorkouts(loaded)
    if (editId) {
      const found = loaded.find(w => w.id === editId)
      if (found) { setEditing({ ...found, exercises: [...found.exercises] }); setMode('edit') }
    }
  }, [editId])

  function createNew() {
    setEditing({ id: genId(), name: '', days: [], exercises: [] })
    setMode('edit')
  }

  function toggleDay(day: number) {
    if (!editing) return
    const days = editing.days.includes(day)
      ? editing.days.filter(d => d !== day)
      : [...editing.days, day]
    setEditing({ ...editing, days })
  }

  function addExercise() {
    if (!editing || !newExName.trim()) return
    const sets = Array.from({ length: Number(newExSets) || 3 }, () => ({
      reps: Number(newExReps) || 10,
      weight: 0,
    }))
    const ex: Exercise = {
      id: genId(),
      name: newExName.trim(),
      muscle: newExMuscle.trim() || '—',
      sets,
    }
    setEditing({ ...editing, exercises: [...editing.exercises, ex] })
    setNewExName(''); setNewExMuscle(''); setNewExSets('3'); setNewExReps('10')
    setShowAddEx(false)
  }

  function removeExercise(exId: string) {
    if (!editing) return
    setEditing({ ...editing, exercises: editing.exercises.filter(e => e.id !== exId) })
  }

  function saveEditing() {
    if (!editing || !editing.name.trim()) return
    const updated = workouts.some(w => w.id === editing.id)
      ? workouts.map(w => w.id === editing.id ? editing : w)
      : [...workouts, editing]
    saveWorkouts(updated)
    setWorkouts(updated)
    setMode('list')
    setEditing(null)
  }

  function deleteWorkout(id: string) {
    const updated = workouts.filter(w => w.id !== id)
    saveWorkouts(updated)
    setWorkouts(updated)
  }

  // ── LIST VIEW ───────────────────────────────────────────

  if (mode === 'list') {
    return (
      <div className="flex flex-col min-h-dvh bg-black">
        <div className="flex items-center gap-3 px-5 pt-14 pb-6">
          <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-black tracking-tight">Mi rutina</h1>
        </div>

        <div className="flex-1 px-4 space-y-3 pb-32 overflow-y-auto">
          {workouts.map(w => (
            <div key={w.id} className="bg-[#111] border border-[#222] rounded-xl px-4 py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-base">{w.name}</p>
                  <p className="text-xs text-[#555] mt-0.5">{w.exercises.length} ejercicios</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditing({ ...w }); setMode('edit') }}
                    className="text-[#555] hover:text-white transition-colors p-1"
                  >
                    <Plus size={16} className="rotate-45" />
                  </button>
                  <button
                    onClick={() => deleteWorkout(w.id)}
                    className="text-[#555] hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mt-2">
                {[0,1,2,3,4,5,6].map(d => (
                  <span
                    key={d}
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      w.days.includes(d) ? 'bg-white text-black font-bold' : 'bg-[#1a1a1a] text-[#444]'
                    }`}
                  >
                    {DAY_NAMES[d]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4">
          <button
            onClick={createNew}
            className="w-full h-14 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Plus size={20} strokeWidth={2.5} />
            Nuevo entreno
          </button>
        </div>

        <BottomNav />
      </div>
    )
  }

  // ── EDIT VIEW ───────────────────────────────────────────

  if (!editing) return null

  return (
    <>
      {showLibrary && (
        <WgerPicker
          onSelect={(name, muscle) => {
            setNewExName(name)
            setNewExMuscle(muscle)
            setShowAddEx(true)
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}

      <div className="flex flex-col min-h-dvh bg-black">
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <button
            onClick={() => { setMode('list'); setEditing(null) }}
            className="text-[#888] hover:text-white transition-colors p-1 -ml-1"
          >
            <X size={22} />
          </button>
          <button
            onClick={saveEditing}
            disabled={!editing.name.trim()}
            className="flex items-center gap-1.5 text-white font-semibold text-sm disabled:text-[#444] transition-colors"
          >
            <Check size={16} /> Guardar
          </button>
        </div>

        <div className="flex-1 px-4 pb-32 overflow-y-auto space-y-6">
          {/* Name */}
          <div>
            <label className="text-[#555] text-xs uppercase tracking-wider font-medium block mb-2">Nombre</label>
            <input
              type="text"
              value={editing.name}
              onChange={e => setEditing({ ...editing, name: e.target.value })}
              placeholder="Ej: Push, Piernas, Full Body..."
              className="w-full h-12 bg-[#111] border border-[#222] rounded-xl px-4 text-base font-semibold focus:outline-none focus:border-white/30 placeholder:text-[#333]"
            />
          </div>

          {/* Days */}
          <div>
            <label className="text-[#555] text-xs uppercase tracking-wider font-medium block mb-3">Días</label>
            <div className="flex gap-2">
              {[0,1,2,3,4,5,6].map(d => (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`flex-1 h-10 rounded-lg font-mono text-xs font-bold transition-all active:scale-95 ${
                    editing.days.includes(d)
                      ? 'bg-white text-black'
                      : 'bg-[#111] border border-[#222] text-[#555] hover:border-[#444]'
                  }`}
                >
                  {DAY_NAMES[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div>
            <label className="text-[#555] text-xs uppercase tracking-wider font-medium block mb-3">
              Ejercicios ({editing.exercises.length})
            </label>

            <div className="space-y-2 mb-3">
              {editing.exercises.map(ex => (
                <div key={ex.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                  <GripVertical size={14} className="text-[#333] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ex.name}</p>
                    <p className="text-xs text-[#555] font-mono">
                      {ex.muscle} · {ex.sets.length} × {ex.sets[0]?.reps} reps
                    </p>
                  </div>
                  <button
                    onClick={() => removeExercise(ex.id)}
                    className="text-[#444] hover:text-red-500 transition-colors p-1 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add exercise */}
            {showAddEx ? (
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExName}
                    onChange={e => setNewExName(e.target.value)}
                    placeholder="Nombre del ejercicio"
                    className="flex-1 h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 text-sm font-semibold focus:outline-none focus:border-white/30 placeholder:text-[#333]"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowLibrary(true)}
                    className="shrink-0 h-11 px-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#555] hover:text-white hover:border-[#444] transition-colors"
                    title="Buscar en biblioteca"
                  >
                    <Search size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={newExMuscle}
                  onChange={e => setNewExMuscle(e.target.value)}
                  placeholder="Músculo (ej: Pecho, Espalda...)"
                  className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 text-sm focus:outline-none focus:border-white/30 placeholder:text-[#333]"
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1">Series</label>
                    <input
                      type="number"
                      value={newExSets}
                      onChange={e => setNewExSets(e.target.value)}
                      inputMode="numeric"
                      className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-center font-mono text-base font-bold focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1">Reps obj.</label>
                    <input
                      type="number"
                      value={newExReps}
                      onChange={e => setNewExReps(e.target.value)}
                      inputMode="numeric"
                      className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-center font-mono text-base font-bold focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setShowAddEx(false); setNewExName(''); setNewExMuscle('') }}
                    className="flex-1 h-10 border border-[#222] rounded-lg text-[#666] text-sm font-medium hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addExercise}
                    disabled={!newExName.trim()}
                    className="flex-1 h-10 bg-white text-black rounded-lg text-sm font-bold disabled:opacity-30 transition-opacity active:scale-[0.98]"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddEx(true)}
                  className="flex-1 h-11 border border-dashed border-[#222] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#444] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Escribir ejercicio
                </button>
                <button
                  onClick={() => setShowLibrary(true)}
                  className="h-11 px-4 border border-dashed border-[#222] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#444] transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={14} /> Biblioteca
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function RoutinePage() {
  return (
    <Suspense>
      <RoutineContent />
    </Suspense>
  )
}
