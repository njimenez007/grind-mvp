'use client'

import { useState } from 'react'
import { X, Search, ChevronLeft, Check } from 'lucide-react'
import { EXERCISES, MUSCLE_GROUPS, LibraryExercise } from '@/lib/exerciseLibrary'
import { BlockType, RoutineExercise, WeightType } from '@/lib/types'
import { genId } from '@/lib/utils'

interface Props {
  blockType: BlockType
  onAdd: (exercise: RoutineExercise) => void
  onClose: () => void
}

function defaultsForBlock(blockType: BlockType): { sets: number; reps: number; rest: number } {
  if (blockType === 'warmup') return { sets: 1, reps: 10, rest: 0 }
  if (blockType === 'closing') return { sets: 2, reps: 30, rest: 0 }
  return { sets: 3, reps: 10, rest: 90 }
}

const BLOCK_LABEL: Record<BlockType, string> = {
  warmup: 'Calentamiento',
  main: 'Bloque principal',
  closing: 'Cierre',
}

export default function ExercisePicker({ blockType, onAdd, onClose }: Props) {
  const [screen, setScreen] = useState<'search' | 'configure'>('search')
  const [query, setQuery] = useState('')
  const [muscleFilter, setMuscleFilter] = useState<string | null>(
    blockType === 'warmup' ? 'Calentamiento' : blockType === 'closing' ? 'Cierre' : null
  )
  const [selected, setSelected] = useState<LibraryExercise | null>(null)

  // Configure state
  const defaults = defaultsForBlock(blockType)
  const [variant, setVariant] = useState('A')
  const [sets, setSets] = useState(defaults.sets)
  const [reps, setReps] = useState(defaults.reps)
  const [rest, setRest] = useState(defaults.rest)
  const [weight, setWeight] = useState(0)

  const filtered = EXERCISES.filter(ex => {
    const matchesMuscle = !muscleFilter || ex.muscle === muscleFilter
    const matchesQuery = !query.trim() ||
      ex.name.toLowerCase().includes(query.toLowerCase())
    return matchesMuscle && matchesQuery
  })

  function pickExercise(ex: LibraryExercise) {
    setSelected(ex)
    const firstVariant = ex.variants[0]
    setVariant(firstVariant.label)
    const d = defaultsForBlock(blockType)
    setSets(d.sets)
    setReps(d.reps)
    setRest(d.rest)
    setWeight(0)
    setScreen('configure')
  }

  function handleAdd() {
    if (!selected) return
    const selectedV = selected.variants.find(v => v.label === variant) ?? selected.variants[0]
    const exercise: RoutineExercise = {
      id: genId(),
      exerciseId: selected.id,
      exerciseName: selected.name,
      muscle: selected.muscle,
      selectedVariant: selectedV.label,
      variantName: selectedV.name,
      sets,
      reps,
      restSeconds: rest,
      weightType: selectedV.weightType as WeightType,
      defaultWeight: selectedV.weightType === 'kg' ? weight : 0,
    }
    onAdd(exercise)
  }

  const currentVariant = selected?.variants.find(v => v.label === variant)
  const isBodyweight = currentVariant?.weightType === 'bodyweight'

  // ── CONFIGURE SCREEN ─────────────────────────────────────

  if (screen === 'configure' && selected) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col max-w-md mx-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-14 pb-4 shrink-0 border-b border-white/[0.08]">
          <button onClick={() => setScreen('search')} className="text-[#8A8A8A] hover:text-white p-1 -ml-1">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#8A8A8A] uppercase tracking-[0.18em] font-medium">{BLOCK_LABEL[blockType]}</p>
            <h2 className="font-black text-base tracking-tight truncate">{selected.name}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Description */}
          <div>
            <p className="text-[#DEDEDE] text-sm leading-relaxed">{selected.description}</p>
            {selected.why && (
              <div className="mt-3 border-l-2 border-white/10 pl-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#555] font-semibold mb-1">POR QUÉ</p>
                <p className="text-[#8A8A8A] text-xs leading-relaxed">{selected.why}</p>
              </div>
            )}
          </div>

          {/* Variant selector */}
          {selected.variants.length > 1 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#555] font-semibold mb-3">OPCIÓN</p>
              <div className="space-y-2">
                {selected.variants.map(v => (
                  <button
                    key={v.label}
                    onClick={() => setVariant(v.label)}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      variant === v.label
                        ? 'bg-white/[0.06] border-white/20'
                        : 'border-white/[0.08] hover:border-white/14'
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${
                      variant === v.label ? 'bg-white border-white text-black' : 'border-[#333] text-[#555]'
                    }`}>
                      {v.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${variant === v.label ? 'text-white' : 'text-[#8A8A8A]'}`}>
                        {v.name}
                      </p>
                      {v.condition && (
                        <p className="text-[11px] text-[#555] mt-0.5 italic">{v.condition}</p>
                      )}
                      <span className={`inline-block text-[10px] mt-1 font-medium uppercase tracking-wider ${
                        v.weightType === 'bodyweight' ? 'text-[#555]' : 'text-[#555]'
                      }`}>
                        {v.weightType === 'bodyweight' ? 'Peso corporal' : 'Con peso (kg)'}
                      </span>
                    </div>
                    {variant === v.label && <Check size={14} className="text-white shrink-0 mt-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Series, reps, rest, weight */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#555] font-semibold mb-3">CONFIGURACIÓN</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Series</label>
                <input
                  type="number" inputMode="numeric"
                  value={sets}
                  onChange={e => setSets(Number(e.target.value) || 1)}
                  className="w-full h-12 bg-[#111] border border-white/10 rounded-xl text-center font-mono font-bold text-base focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">
                  {blockType === 'closing' ? 'Seg.' : 'Reps'}
                </label>
                <input
                  type="number" inputMode="numeric"
                  value={reps}
                  onChange={e => setReps(Number(e.target.value) || 1)}
                  className="w-full h-12 bg-[#111] border border-white/10 rounded-xl text-center font-mono font-bold text-base focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Desc. (s)</label>
                <input
                  type="number" inputMode="numeric"
                  value={rest}
                  onChange={e => setRest(Number(e.target.value))}
                  className="w-full h-12 bg-[#111] border border-white/10 rounded-xl text-center font-mono font-bold text-base focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {!isBodyweight && (
              <div className="mt-3">
                <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Peso objetivo (kg)</label>
                <input
                  type="number" inputMode="decimal"
                  value={weight || ''}
                  onChange={e => setWeight(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full h-12 bg-[#111] border border-white/10 rounded-xl px-4 font-mono font-bold text-base focus:outline-none focus:border-white/30 placeholder:text-[#333]"
                />
              </div>
            )}

            {isBodyweight && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <span className="text-[11px] text-[#555] uppercase tracking-wider">Peso: Peso corporal</span>
              </div>
            )}
          </div>
        </div>

        {/* Add button */}
        <div className="px-5 py-4 border-t border-white/[0.08] shrink-0">
          <button
            onClick={handleAdd}
            className="w-full h-14 bg-white text-black font-bold text-sm uppercase tracking-[0.08em] rounded-xl active:scale-[0.98] transition-transform"
          >
            Agregar al {BLOCK_LABEL[blockType]}
          </button>
        </div>
      </div>
    )
  }

  // ── SEARCH SCREEN ─────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col max-w-md mx-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 shrink-0">
        <button onClick={onClose} className="text-[#8A8A8A] hover:text-white p-1 -ml-1">
          <X size={22} />
        </button>
        <div>
          <p className="text-[10px] text-[#8A8A8A] uppercase tracking-[0.18em] font-medium">{BLOCK_LABEL[blockType]}</p>
          <h2 className="font-black text-lg tracking-tight">Agregar ejercicio</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-3 shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar ejercicio..."
            autoFocus
            className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:border-white/20 placeholder:text-[#333]"
          />
        </div>
      </div>

      {/* Muscle filter chips */}
      <div className="px-5 mb-3 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setMuscleFilter(null)}
            className={`shrink-0 px-3 h-7 rounded-full text-[11px] font-semibold transition-all ${
              muscleFilter === null ? 'bg-white text-black' : 'bg-[#111] border border-white/10 text-[#555]'
            }`}
          >
            Todo
          </button>
          {MUSCLE_GROUPS.map(m => (
            <button
              key={m}
              onClick={() => setMuscleFilter(muscleFilter === m ? null : m)}
              className={`shrink-0 px-3 h-7 rounded-full text-[11px] font-semibold transition-all ${
                muscleFilter === m ? 'bg-white text-black' : 'bg-[#111] border border-white/10 text-[#555]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {filtered.length === 0 ? (
          <p className="text-center text-[#444] text-sm py-16">Sin resultados para "{query}"</p>
        ) : (
          filtered.map(ex => (
            <button
              key={ex.id}
              onClick={() => pickExercise(ex)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-[#111] border border-white/[0.06] rounded-xl text-left hover:border-white/12 active:scale-[0.98] transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{ex.name}</p>
                <p className="text-[#555] text-xs mt-0.5">{ex.muscle}</p>
              </div>
              <span className="text-[10px] text-[#333] font-mono shrink-0 ml-2">
                {ex.variants.length > 1 ? `${ex.variants.length} opciones` : ex.variants[0]?.weightType === 'bodyweight' ? 'Peso corporal' : 'Con peso'}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
