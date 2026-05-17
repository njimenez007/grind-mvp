'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Search, Dumbbell } from 'lucide-react'
import { fetchWgerCategories, fetchWgerExercises, WgerCategory, WgerExercise } from '@/lib/wger'

interface Props {
  onSelect: (name: string, muscle: string) => void
  onClose: () => void
}

const LIMIT = 30

function ExerciseImage({ ex }: { ex: WgerExercise }) {
  const [imgSrc, setImgSrc] = useState<string | null>(ex.exerciseImageUrl || ex.muscleImageUrl)
  const [failed, setFailed] = useState(false)

  if (failed || !imgSrc) {
    return (
      <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center shrink-0">
        <Dumbbell size={18} className="text-[#333]" />
      </div>
    )
  }

  return (
    <div className="w-14 h-14 rounded-full bg-[#0a0a0a] overflow-hidden shrink-0 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={ex.name}
        loading="lazy"
        className="w-full h-full object-contain p-0.5"
        onError={() => {
          // Try fallback: exercise image → muscle SVG → failed
          if (imgSrc === ex.exerciseImageUrl && ex.muscleImageUrl) {
            setImgSrc(ex.muscleImageUrl)
          } else {
            setFailed(true)
          }
        }}
      />
    </div>
  )
}

export default function WgerPicker({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<WgerCategory[]>([])
  const [allExercises, setAllExercises] = useState<WgerExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const prevCat = useRef<number | null>(null)

  // Load categories once
  useEffect(() => {
    fetchWgerCategories().then(setCategories)
  }, [])

  // Load exercises when category changes
  useEffect(() => {
    if (prevCat.current === categoryId) return
    prevCat.current = categoryId
    setQuery('')
    setAllExercises([])
    setOffset(0)
    setLoading(true)
    fetchWgerExercises({ categoryId: categoryId ?? undefined, offset: 0, limit: LIMIT }).then((r) => {
      setAllExercises(r.exercises)
      setHasMore(r.hasMore)
      setOffset(LIMIT)
      setLoading(false)
    })
  }, [categoryId])

  async function loadMore() {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const r = await fetchWgerExercises({ categoryId: categoryId ?? undefined, offset, limit: LIMIT })
    setAllExercises((prev) => [...prev, ...r.exercises])
    setHasMore(r.hasMore)
    setOffset((o) => o + LIMIT)
    setLoadingMore(false)
  }

  const filtered = query.trim()
    ? allExercises.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(query.toLowerCase())
      )
    : allExercises

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col max-w-md mx-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 shrink-0">
        <button onClick={onClose} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <X size={22} />
        </button>
        <h2 className="text-xl font-black tracking-tight">Agregar ejercicio</h2>
      </div>

      {/* Search */}
      <div className="px-5 mb-3 shrink-0">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ejercicio..."
            autoFocus
            className="w-full h-10 bg-[#111] border border-[#222] rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:border-white/30 placeholder:text-[#333]"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-5 mb-3 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCategoryId(null)}
            className={`shrink-0 px-3 h-7 rounded-full text-xs font-semibold transition-all ${
              categoryId === null ? 'bg-white text-black' : 'bg-[#111] border border-[#222] text-[#555]'
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`shrink-0 px-3 h-7 rounded-full text-xs font-semibold transition-all ${
                categoryId === cat.id ? 'bg-white text-black' : 'bg-[#111] border border-[#222] text-[#555]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="w-14 h-14 rounded-full bg-[#111] shrink-0 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#111] rounded animate-pulse w-2/3" />
                  <div className="h-2 bg-[#0a0a0a] rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <Dumbbell size={32} className="text-[#222] mb-4" />
            <p className="text-[#444] font-semibold">Sin resultados</p>
            <p className="text-[#333] text-sm mt-1">
              {query ? 'Prueba con otro término' : 'Cargando ejercicios...'}
            </p>
          </div>
        ) : (
          <>
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => { onSelect(ex.name, ex.muscle); onClose() }}
                className="w-full flex items-center gap-4 px-5 py-3 border-b border-[#080808] active:bg-[#111] transition-colors text-left"
              >
                <ExerciseImage ex={ex} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug">{ex.name}</p>
                  <p className="text-[#555] text-xs mt-0.5">{ex.muscle}</p>
                </div>
              </button>
            ))}

            {!query && hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-5 text-sm text-[#555] hover:text-white transition-colors disabled:text-[#333]"
              >
                {loadingMore ? 'Cargando...' : 'Cargar más ejercicios'}
              </button>
            )}

            {!query && !hasMore && filtered.length > 0 && (
              <p className="text-center text-[#333] text-xs py-5">
                {filtered.length} ejercicios cargados
              </p>
            )}
          </>
        )}
      </div>

      {/* Hint */}
      {!loading && query === '' && allExercises.length > 0 && (
        <p className="shrink-0 text-center text-[#2a2a2a] text-[10px] py-2 px-4">
          Base de datos Wger · {allExercises.length} ejercicios cargados
        </p>
      )}
    </div>
  )
}
