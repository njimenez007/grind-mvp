'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Check, Trophy } from 'lucide-react'
import { getGoals, saveGoal, deleteGoal } from '@/lib/storage'
import { Goal } from '@/lib/types'
import { genId } from '@/lib/utils'
import BottomNav from '@/components/BottomNav'

const UNIT_PRESETS = ['kg', 'seg', 'rep', 'km', '%', 'días']

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [gName, setGName] = useState('')
  const [gTarget, setGTarget] = useState('')
  const [gCurrent, setGCurrent] = useState('')
  const [gUnit, setGUnit] = useState('kg')
  const [gCustomUnit, setGCustomUnit] = useState('')

  useEffect(() => {
    setGoals(getGoals())
  }, [])

  function addGoal() {
    if (!gName.trim() || !gTarget) return
    const unit = gUnit === 'custom' ? gCustomUnit.trim() || '—' : gUnit
    const goal: Goal = {
      id: genId(),
      name: gName.trim(),
      target: Number(gTarget),
      current: Number(gCurrent) || 0,
      unit,
      createdAt: Date.now(),
    }
    saveGoal(goal)
    setGoals(prev => [goal, ...prev])
    setGName(''); setGTarget(''); setGCurrent(''); setGUnit('kg'); setGCustomUnit('')
    setShowForm(false)
  }

  function updateCurrent(id: string, value: string) {
    const num = Number(value)
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g
      const updated: Goal = { ...g, current: num }
      if (num >= g.target && !g.completedAt) updated.completedAt = Date.now()
      if (num < g.target && g.completedAt) updated.completedAt = undefined
      saveGoal(updated)
      return updated
    }))
  }

  function removeGoal(id: string) {
    deleteGoal(id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const active = goals.filter(g => !g.completedAt)
  const completed = goals.filter(g => g.completedAt)

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Objetivos</h1>
      </div>

      <div className="flex-1 px-4 pb-28 overflow-y-auto space-y-5">

        {/* Add button */}
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-full h-11 border border-dashed border-[#222] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#444] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Nuevo objetivo
        </button>

        {/* Form */}
        {showForm && (
          <div className="bg-[#111] border border-[#222] rounded-xl p-4 space-y-3">
            <input
              type="text"
              value={gName}
              onChange={e => setGName(e.target.value)}
              placeholder="Ej: Levantar 100 kg en press de banca"
              className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 text-sm font-semibold focus:outline-none focus:border-white/30 placeholder:text-[#333]"
              autoFocus
            />

            {/* Unit selector */}
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-2">Unidad</label>
              <div className="flex gap-1.5 flex-wrap">
                {UNIT_PRESETS.map(u => (
                  <button
                    key={u}
                    onClick={() => setGUnit(u)}
                    className={`px-3 h-8 rounded-lg text-xs font-bold transition-all ${
                      gUnit === u ? 'bg-white text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#555] hover:border-[#444]'
                    }`}
                  >
                    {u}
                  </button>
                ))}
                <button
                  onClick={() => setGUnit('custom')}
                  className={`px-3 h-8 rounded-lg text-xs font-bold transition-all ${
                    gUnit === 'custom' ? 'bg-white text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#555] hover:border-[#444]'
                  }`}
                >
                  Otra
                </button>
              </div>
              {gUnit === 'custom' && (
                <input
                  type="text"
                  value={gCustomUnit}
                  onChange={e => setGCustomUnit(e.target.value)}
                  placeholder="Escribe la unidad..."
                  className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 text-sm mt-2 focus:outline-none focus:border-white/30 placeholder:text-[#333]"
                />
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1">Actual</label>
                <input
                  type="number"
                  value={gCurrent}
                  onChange={e => setGCurrent(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 font-mono font-bold focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1">Meta</label>
                <input
                  type="number"
                  value={gTarget}
                  onChange={e => setGTarget(e.target.value)}
                  inputMode="decimal"
                  placeholder="100"
                  className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 font-mono font-bold focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 h-10 border border-[#222] rounded-lg text-[#666] text-sm">Cancelar</button>
              <button
                onClick={addGoal}
                disabled={!gName.trim() || !gTarget}
                className="flex-1 h-10 bg-white text-black rounded-lg text-sm font-bold disabled:opacity-30"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {/* Active goals */}
        {active.length > 0 && (
          <div className="space-y-3">
            {active.map(g => {
              const pct = Math.min(100, (g.current / g.target) * 100)
              return (
                <div key={g.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-sm flex-1 pr-2">{g.name}</p>
                    <button onClick={() => removeGoal(g.id)} className="text-[#333] hover:text-red-500 transition-colors p-1 shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={g.current}
                        onChange={e => updateCurrent(g.id, e.target.value)}
                        inputMode="decimal"
                        className="w-16 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-center font-mono text-sm font-bold focus:outline-none focus:border-white/30"
                      />
                      <span className="text-[#555] text-xs">/ {g.target} {g.unit}</span>
                    </div>
                    <span className="font-mono text-xs text-[#666]">{Math.round(pct)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Completed goals */}
        {completed.length > 0 && (
          <div>
            <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-3 px-1">
              Completados
            </p>
            <div className="space-y-2">
              {completed.map(g => (
                <div key={g.id} className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm text-[#666] line-through">{g.name}</p>
                      <p className="text-[#444] text-xs font-mono">{g.target} {g.unit}</p>
                    </div>
                  </div>
                  <button onClick={() => removeGoal(g.id)} className="text-[#222] hover:text-red-500 transition-colors p-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy size={32} className="text-[#222] mb-4" />
            <p className="text-[#444] font-semibold">Sin objetivos</p>
            <p className="text-[#333] text-sm mt-1">Crea tu primera meta</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
