'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '@/lib/exerciseData'
import { ExerciseTemplate } from '@/lib/types'
import BottomNav from '@/components/BottomNav'

export default function ExercisesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<string>('Todo')
  const [expanded, setExpanded] = useState<string | null>(null)

  const groups = ['Todo', ...MUSCLE_GROUPS]

  const filtered = EXERCISE_LIBRARY.filter(ex => {
    const matchGroup = activeGroup === 'Todo' || ex.muscle === activeGroup
    const matchSearch = search.trim() === '' || ex.name.toLowerCase().includes(search.toLowerCase())
    return matchGroup && matchSearch
  })

  const grouped = groups
    .filter(g => g !== 'Todo')
    .reduce<Record<string, ExerciseTemplate[]>>((acc, g) => {
      const list = filtered.filter(e => e.muscle === g)
      if (list.length > 0) acc[g] = list
      return acc
    }, {})

  function toggleExpand(id: string) {
    setExpanded(prev => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Ejercicios</h1>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ejercicio..."
            className="w-full h-11 bg-[#111] border border-[#222] rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:border-white/30 placeholder:text-[#333]"
          />
        </div>
      </div>

      {/* Group filter */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`shrink-0 px-3 h-8 rounded-full text-xs font-semibold transition-all ${
                activeGroup === g
                  ? 'bg-white text-black'
                  : 'bg-[#111] border border-[#222] text-[#666] hover:border-[#444]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 px-4 pb-36 space-y-5 overflow-y-auto">
        {Object.entries(grouped).map(([group, exercises]) => (
          <div key={group}>
            <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-2 px-1">
              {group}
            </p>
            <div className="space-y-1">
              {exercises.map(ex => (
                <div key={ex.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                  <button
                    onClick={() => ex.variants?.length ? toggleExpand(ex.id) : undefined}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-lg leading-none">{ex.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{ex.name}</p>
                        <p className="text-[#555] text-xs mt-0.5">{ex.muscle}</p>
                      </div>
                    </div>
                    {ex.variants?.length ? (
                      expanded === ex.id
                        ? <ChevronDown size={14} className="text-[#444]" />
                        : <ChevronRight size={14} className="text-[#333]" />
                    ) : null}
                  </button>

                  {/* Variants */}
                  {expanded === ex.id && ex.variants && (
                    <div className="border-t border-[#1a1a1a] px-4 py-3 space-y-2">
                      {ex.variants.map(v => (
                        <div key={v.label} className="flex items-center gap-3">
                          <span className="font-mono text-[10px] bg-[#222] text-[#888] px-2 py-0.5 rounded font-bold">
                            {v.label}
                          </span>
                          <span className="text-[#666] text-sm">{v.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#444] font-semibold">Sin resultados</p>
            <p className="text-[#333] text-sm mt-1">Intenta con otro término</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
