'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, GripVertical, Check, X, ChevronRight, Play, Edit2 } from 'lucide-react'
import { getWorkouts, saveWorkouts } from '@/lib/storage'
import { Workout, BlockType, RoutineBlock, RoutineExercise } from '@/lib/types'
import { DAY_NAMES, genId } from '@/lib/utils'
import { Suspense } from 'react'
import BottomNav from '@/components/BottomNav'
import ExercisePicker from '@/components/ExercisePicker'

const DAY_FULL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const BLOCK_LABEL: Record<BlockType, string> = {
  warmup: 'CALENTAMIENTO',
  main: 'BLOQUE PRINCIPAL',
  closing: 'CIERRE',
}

const BLOCK_HINT: Record<BlockType, string> = {
  warmup: 'Movilidad y activación antes del trabajo principal.',
  main: 'El núcleo del entrenamiento.',
  closing: 'Estiramientos, gemelos y recuperación.',
}

const BLOCK_TYPES: BlockType[] = ['warmup', 'main', 'closing']

function emptyBlocks(): RoutineBlock[] {
  return BLOCK_TYPES.map(type => ({ type, exercises: [] }))
}

function emptyWorkout(): Workout {
  return { id: genId(), name: '', days: [], blocks: emptyBlocks() }
}

function getBlock(workout: Workout, type: BlockType): RoutineBlock {
  return workout.blocks?.find(b => b.type === type) ?? { type, exercises: [] }
}

// ── Main content ──────────────────────────────────────────────────────────────

function RoutineContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [view, setView] = useState<'list' | 'detail' | 'edit'>('list')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Workout | null>(null)
  const [pickerBlock, setPickerBlock] = useState<BlockType | null>(null)

  useEffect(() => {
    const loaded = getWorkouts()
    setWorkouts(loaded)
    if (editId) {
      const found = loaded.find(w => w.id === editId)
      if (found) {
        openEdit(found)
      }
    }
  }, [editId])

  const selected = workouts.find(w => w.id === selectedId) ?? null

  function openDetail(id: string) {
    setSelectedId(id)
    setView('detail')
  }

  function openCreate() {
    setEditing(emptyWorkout())
    setView('edit')
  }

  function openEdit(workout: Workout) {
    const w: Workout = {
      ...workout,
      blocks: workout.blocks?.length
        ? workout.blocks
        : emptyBlocks(),
    }
    setEditing(w)
    setView('edit')
  }

  function saveEditing() {
    if (!editing || !editing.name.trim()) return
    const updated = workouts.some(w => w.id === editing.id)
      ? workouts.map(w => w.id === editing.id ? editing : w)
      : [...workouts, editing]
    saveWorkouts(updated)
    setWorkouts(updated)
    setView('list')
    setEditing(null)
  }

  function removeWorkout(id: string) {
    const updated = workouts.filter(w => w.id !== id)
    saveWorkouts(updated)
    setWorkouts(updated)
    if (selectedId === id) { setSelectedId(null); setView('list') }
  }

  function toggleDay(day: number) {
    if (!editing) return
    const days = editing.days.includes(day)
      ? editing.days.filter(d => d !== day)
      : [...editing.days, day]
    setEditing({ ...editing, days })
  }

  function addExercise(exercise: RoutineExercise) {
    if (!editing || !pickerBlock) return
    setEditing(prev => {
      if (!prev) return prev
      return {
        ...prev,
        blocks: prev.blocks!.map(b =>
          b.type === pickerBlock ? { ...b, exercises: [...b.exercises, exercise] } : b
        ),
      }
    })
    setPickerBlock(null)
  }

  function removeExercise(blockType: BlockType, exId: string) {
    setEditing(prev => {
      if (!prev) return prev
      return {
        ...prev,
        blocks: prev.blocks!.map(b =>
          b.type === blockType ? { ...b, exercises: b.exercises.filter(e => e.id !== exId) } : b
        ),
      }
    })
  }

  function updateExercise(blockType: BlockType, exId: string, patch: Partial<RoutineExercise>) {
    setEditing(prev => {
      if (!prev) return prev
      return {
        ...prev,
        blocks: prev.blocks!.map(b =>
          b.type === blockType
            ? { ...b, exercises: b.exercises.map(e => e.id === exId ? { ...e, ...patch } : e) }
            : b
        ),
      }
    })
  }

  // ── LIST VIEW ─────────────────────────────────────────────

  if (view === 'list') {
    return (
      <div className="flex flex-col min-h-dvh bg-[#0A0A0A]">
        <div className="flex items-center gap-3 px-5 pt-14 pb-6">
          <button onClick={() => router.back()} className="text-[#8A8A8A] hover:text-white p-1 -ml-1">
            <ArrowLeft size={22} />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#555] font-medium">Planificación</p>
            <h1 className="text-xl font-black tracking-tight">Mis rutinas</h1>
          </div>
        </div>

        <div className="flex-1 px-4 pb-36 overflow-y-auto">
          {workouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center mb-4">
                <Plus size={22} className="text-[#444]" />
              </div>
              <p className="font-bold text-[#DEDEDE]">Sin rutinas</p>
              <p className="text-[#555] text-sm mt-1">Creá tu primera rutina estructurada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map(w => {
                const mainBlock = w.blocks?.find(b => b.type === 'main')
                const totalEx = w.blocks
                  ? w.blocks.reduce((acc, b) => acc + b.exercises.length, 0)
                  : (w.exercises?.length ?? 0)
                const mainEx = mainBlock?.exercises.length ?? (w.exercises?.length ?? 0)

                return (
                  <button
                    key={w.id}
                    onClick={() => openDetail(w.id)}
                    className="w-full bg-[#111] border border-white/[0.08] rounded-2xl px-4 py-4 text-left hover:border-white/14 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-black text-base tracking-tight">{w.name}</p>
                        <p className="text-[#8A8A8A] text-xs mt-0.5">
                          {mainEx} ejercicio{mainEx !== 1 ? 's' : ''} principales · {totalEx} en total
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-[#333] mt-1 shrink-0" />
                    </div>
                    {w.days.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {[0,1,2,3,4,5,6].map(d => (
                          <span
                            key={d}
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              w.days.includes(d) ? 'bg-white text-black font-bold' : 'text-[#333]'
                            }`}
                          >
                            {DAY_NAMES[d]}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="fixed left-0 right-0 max-w-md mx-auto px-4" style={{ bottom: 'calc(3.75rem + env(safe-area-inset-bottom))' }}>
          <button
            onClick={openCreate}
            className="w-full h-14 bg-white text-black font-bold text-sm uppercase tracking-[0.08em] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Plus size={18} strokeWidth={2.5} />
            Nueva rutina
          </button>
        </div>

        <BottomNav />
      </div>
    )
  }

  // ── DETAIL VIEW ───────────────────────────────────────────

  if (view === 'detail' && selected) {
    const allEx = selected.blocks?.flatMap(b => b.exercises) ?? selected.exercises ?? []
    const totalSets = allEx.reduce((acc, ex) => {
      if ('sets' in ex && typeof ex.sets === 'number') return acc + ex.sets
      if (Array.isArray((ex as any).sets)) return acc + (ex as any).sets.length
      return acc
    }, 0)

    return (
      <div className="flex flex-col min-h-dvh bg-[#0A0A0A]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <button onClick={() => setView('list')} className="text-[#8A8A8A] hover:text-white p-1 -ml-1">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openEdit(selected)}
              className="text-[#8A8A8A] hover:text-white transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => removeWorkout(selected.id)}
              className="text-[#444] hover:text-red-500 transition-colors"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <h1 className="text-2xl font-black tracking-tight">{selected.name}</h1>
          {selected.days.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {[0,1,2,3,4,5,6].map(d => (
                <span
                  key={d}
                  className={`font-mono text-[10px] px-2 py-1 rounded uppercase tracking-wider ${
                    selected.days.includes(d)
                      ? 'bg-white/10 text-white font-bold border border-white/20'
                      : 'text-[#333]'
                  }`}
                >
                  {DAY_FULL[d]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 px-4 pb-36 overflow-y-auto space-y-4">
          {selected.blocks ? (
            selected.blocks.map(block => (
              <div key={block.type}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555]">
                    {BLOCK_LABEL[block.type]}
                  </p>
                  <span className="text-[#333] text-[10px]">({block.exercises.length})</span>
                </div>
                {block.exercises.length === 0 ? (
                  <p className="text-[#333] text-xs italic px-1 pb-2">Sin ejercicios</p>
                ) : (
                  <div className="space-y-1.5">
                    {block.exercises.map((ex, i) => (
                      <div
                        key={ex.id}
                        className="bg-[#111] border border-white/[0.06] rounded-xl px-4 py-3"
                      >
                        <div className="flex items-start gap-2.5 mb-1">
                          <span className="text-[10px] font-bold text-[#555] font-mono mt-0.5 w-4 shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold bg-white/10 text-[#DEDEDE] px-1.5 py-0.5 rounded uppercase tracking-wide">
                                {ex.selectedVariant}
                              </span>
                              <p className="font-semibold text-sm">{ex.exerciseName}</p>
                            </div>
                            <p className="text-[#555] text-[11px] mt-0.5 ml-0">{ex.variantName}</p>
                            <p className="text-[#8A8A8A] text-[11px] font-mono mt-1">
                              {ex.sets} × {ex.reps}{' '}
                              {block.type === 'closing' ? 'seg' : 'reps'}
                              {ex.restSeconds > 0 && ` · ${ex.restSeconds}s desc`}
                              {ex.weightType === 'kg' && ex.defaultWeight > 0 && ` · ${ex.defaultWeight} kg`}
                              {ex.weightType === 'bodyweight' && ' · Peso corporal'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            // Legacy exercises
            <div className="space-y-2">
              {(selected.exercises ?? []).map((ex, i) => (
                <div key={ex.id} className="bg-[#111] border border-white/[0.06] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#555] font-mono">{i + 1}</span>
                    <p className="font-semibold text-sm">{ex.name}</p>
                  </div>
                  <p className="text-[#555] text-xs ml-5">{ex.muscle} · {ex.sets.length} series</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-4 bg-[#0A0A0A]/90 backdrop-blur-sm border-t border-white/[0.06]"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => router.push(`/warmup/${selected.id}`)}
            className="w-full h-14 bg-white text-black font-bold text-sm uppercase tracking-[0.08em] rounded-xl flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
          >
            <Play size={14} fill="black" strokeWidth={0} />
            Iniciar entrenamiento
          </button>
        </div>
      </div>
    )
  }

  // ── EDIT VIEW ─────────────────────────────────────────────

  if (view === 'edit' && editing) {
    return (
      <>
        {pickerBlock && (
          <ExercisePicker
            blockType={pickerBlock}
            onAdd={addExercise}
            onClose={() => setPickerBlock(null)}
          />
        )}

        <div className="flex flex-col min-h-dvh bg-[#0A0A0A]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-14 pb-4">
            <button
              onClick={() => { setView(selectedId ? 'detail' : 'list'); setEditing(null) }}
              className="text-[#8A8A8A] hover:text-white p-1 -ml-1"
            >
              <X size={22} />
            </button>
            <button
              onClick={saveEditing}
              disabled={!editing.name.trim()}
              className="flex items-center gap-1.5 text-white font-semibold text-sm disabled:text-[#333] transition-colors"
            >
              <Check size={15} /> Guardar
            </button>
          </div>

          <div className="flex-1 px-4 pb-36 overflow-y-auto space-y-6">

            {/* Name */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-[#555] font-semibold block mb-2">
                NOMBRE
              </label>
              <input
                type="text"
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                placeholder="Ej: Push, Piernas, Full Body..."
                className="w-full h-12 bg-[#111] border border-white/10 rounded-xl px-4 text-base font-bold focus:outline-none focus:border-white/30 placeholder:text-[#333]"
              />
            </div>

            {/* Days */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-[#555] font-semibold block mb-3">
                DÍAS <span className="text-[#333] normal-case tracking-normal font-normal">(opcional)</span>
              </label>
              <div className="flex gap-2">
                {[0,1,2,3,4,5,6].map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`flex-1 h-10 rounded-lg font-mono text-[10px] font-bold uppercase transition-all active:scale-95 ${
                      editing.days.includes(d)
                        ? 'bg-white text-black'
                        : 'bg-[#111] border border-white/10 text-[#444] hover:border-white/20'
                    }`}
                  >
                    {DAY_NAMES[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Blocks */}
            {(editing.blocks ?? emptyBlocks()).map(block => (
              <div key={block.type}>
                {/* Block header */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {BLOCK_LABEL[block.type]}
                  </p>
                  <p className="text-[#555] text-[11px] mt-0.5">{BLOCK_HINT[block.type]}</p>
                </div>

                {/* Exercise rows */}
                <div className="space-y-2 mb-3">
                  {block.exercises.map(ex => (
                    <ExerciseRow
                      key={ex.id}
                      ex={ex}
                      blockType={block.type}
                      onChange={patch => updateExercise(block.type, ex.id, patch)}
                      onRemove={() => removeExercise(block.type, ex.id)}
                    />
                  ))}
                </div>

                {/* Add button */}
                <button
                  onClick={() => setPickerBlock(block.type)}
                  className="w-full h-11 border border-dashed border-white/[0.12] rounded-xl text-sm text-[#555] hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  Agregar a {BLOCK_LABEL[block.type].toLowerCase()}
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  return null
}

// ── Exercise row in edit mode ─────────────────────────────────────────────────

function ExerciseRow({
  ex,
  blockType,
  onChange,
  onRemove,
}: {
  ex: RoutineExercise
  blockType: BlockType
  onChange: (patch: Partial<RoutineExercise>) => void
  onRemove: () => void
}) {
  return (
    <div className="bg-[#111] border border-white/[0.08] rounded-xl p-3">
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold bg-white/10 text-[#DEDEDE] px-1.5 py-0.5 rounded uppercase">
            {ex.selectedVariant}
          </span>
          <span className="font-semibold text-sm">{ex.exerciseName}</span>
        </div>
        <button onClick={onRemove} className="text-[#333] hover:text-red-500 transition-colors p-0.5 shrink-0 ml-2">
          <Trash2 size={14} />
        </button>
      </div>

      <p className="text-[#555] text-[11px] mb-2 leading-snug">{ex.variantName}</p>

      {/* Config inputs */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[9px] text-[#444] uppercase tracking-wider block mb-1">Series</label>
          <input
            type="number" inputMode="numeric"
            value={ex.sets}
            onChange={e => onChange({ sets: Number(e.target.value) || 1 })}
            className="w-full h-9 bg-[#1a1a1a] border border-white/[0.08] rounded-lg text-center font-mono text-sm font-bold focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex-1">
          <label className="text-[9px] text-[#444] uppercase tracking-wider block mb-1">
            {blockType === 'closing' ? 'Seg' : 'Reps'}
          </label>
          <input
            type="number" inputMode="numeric"
            value={ex.reps}
            onChange={e => onChange({ reps: Number(e.target.value) || 1 })}
            className="w-full h-9 bg-[#1a1a1a] border border-white/[0.08] rounded-lg text-center font-mono text-sm font-bold focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex-1">
          <label className="text-[9px] text-[#444] uppercase tracking-wider block mb-1">Desc (s)</label>
          <input
            type="number" inputMode="numeric"
            value={ex.restSeconds}
            onChange={e => onChange({ restSeconds: Number(e.target.value) })}
            className="w-full h-9 bg-[#1a1a1a] border border-white/[0.08] rounded-lg text-center font-mono text-sm font-bold focus:outline-none focus:border-white/20"
          />
        </div>
        {ex.weightType === 'kg' && (
          <div className="flex-1">
            <label className="text-[9px] text-[#444] uppercase tracking-wider block mb-1">Kg</label>
            <input
              type="number" inputMode="decimal"
              value={ex.defaultWeight || ''}
              onChange={e => onChange({ defaultWeight: Number(e.target.value) || 0 })}
              placeholder="0"
              className="w-full h-9 bg-[#1a1a1a] border border-white/[0.08] rounded-lg text-center font-mono text-sm font-bold focus:outline-none focus:border-white/20 placeholder:text-[#333]"
            />
          </div>
        )}
        {ex.weightType === 'bodyweight' && (
          <div className="flex-1 flex items-end">
            <div className="w-full h-9 flex items-center justify-center">
              <span className="text-[9px] text-[#444] uppercase tracking-wider text-center">Corporal</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page wrapper ──────────────────────────────────────────────────────────────

export default function RoutinePage() {
  return (
    <Suspense>
      <RoutineContent />
    </Suspense>
  )
}
