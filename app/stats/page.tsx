'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getSessions, getBodyStats, saveBodyStat, deleteBodyStat, getAnkleTests, saveAnkleTest, deleteAnkleTest } from '@/lib/storage'
import { Session, BodyStat, AnkleTest } from '@/lib/types'
import { getMuscleVolumes, getWeeklyConsistency, RANK_COLORS, RANK_EMOJI, MuscleVolume } from '@/lib/gamification'
import { genId } from '@/lib/utils'
import BottomNav from '@/components/BottomNav'

type Tab = 'consistencia' | 'rangos' | 'tobillo' | 'cuerpo'

export default function StatsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('consistencia')
  const [sessions, setSessions] = useState<Session[]>([])
  const [bodyStats, setBodyStats] = useState<BodyStat[]>([])
  const [ankleTests, setAnkleTests] = useState<AnkleTest[]>([])
  const [muscleVolumes, setMuscleVolumes] = useState<MuscleVolume[]>([])
  const [consistency, setConsistency] = useState<{ date: Date; trained: boolean }[]>([])

  // Body form
  const [showBodyForm, setShowBodyForm] = useState(false)
  const [bWeight, setBWeight] = useState('')
  const [bFat, setBFat] = useState('')
  const [bMuscle, setBMuscle] = useState('')

  // Ankle form
  const [showAnkleForm, setShowAnkleForm] = useState(false)
  const [aSeconds, setASeconds] = useState('')
  const [aSide, setASide] = useState<'left' | 'right'>('left')

  useEffect(() => {
    const s = getSessions()
    const bs = getBodyStats()
    const at = getAnkleTests()
    setSessions(s)
    setBodyStats(bs)
    setAnkleTests(at)
    setMuscleVolumes(getMuscleVolumes(s))
    setConsistency(getWeeklyConsistency(s, 8))
  }, [])

  function addBodyStat() {
    if (!bWeight && !bFat && !bMuscle) return
    const stat: BodyStat = {
      id: genId(),
      date: new Date().toISOString().slice(0, 10),
      weight: bWeight ? Number(bWeight) : undefined,
      fat: bFat ? Number(bFat) : undefined,
      muscle: bMuscle ? Number(bMuscle) : undefined,
    }
    saveBodyStat(stat)
    setBodyStats(prev => [stat, ...prev])
    setBWeight(''); setBFat(''); setBMuscle('')
    setShowBodyForm(false)
  }

  function addAnkleTest() {
    if (!aSeconds) return
    const test: AnkleTest = {
      id: genId(),
      date: new Date().toISOString().slice(0, 10),
      seconds: Number(aSeconds),
      side: aSide,
    }
    saveAnkleTest(test)
    setAnkleTests(prev => [test, ...prev])
    setASeconds('')
    setShowAnkleForm(false)
  }

  function removeBodyStat(id: string) {
    deleteBodyStat(id)
    setBodyStats(prev => prev.filter(s => s.id !== id))
  }

  function removeAnkleTest(id: string) {
    deleteAnkleTest(id)
    setAnkleTests(prev => prev.filter(t => t.id !== id))
  }

  const trainingDays = consistency.filter(d => d.trained).length

  const TABS: { key: Tab; label: string }[] = [
    { key: 'consistencia', label: 'Consistencia' },
    { key: 'rangos', label: 'Rangos' },
    { key: 'tobillo', label: 'Tobillo' },
    { key: 'cuerpo', label: 'Cuerpo' },
  ]

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Estadísticas</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t.key ? 'bg-white text-black' : 'text-[#555] hover:text-[#888]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-28 overflow-y-auto">

        {/* ── CONSISTENCIA ─────────────────────────────── */}
        {tab === 'consistencia' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
                <p className="font-mono text-3xl font-bold">{sessions.length}</p>
                <p className="text-[#555] text-xs mt-1">sesiones totales</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
                <p className="font-mono text-3xl font-bold">{trainingDays}</p>
                <p className="text-[#555] text-xs mt-1">días / 8 semanas</p>
              </div>
            </div>

            <div>
              <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-3">
                Últimas 8 semanas
              </p>
              {/* Calendar grid — 8 rows of 7 */}
              <div className="space-y-1">
                {Array.from({ length: 8 }).map((_, week) => (
                  <div key={week} className="flex gap-1">
                    {consistency.slice(week * 7, week * 7 + 7).map((day, i) => {
                      const isToday = day.date.toDateString() === new Date().toDateString()
                      return (
                        <div
                          key={i}
                          title={day.date.toLocaleDateString('es')}
                          className={`flex-1 h-6 rounded-sm ${
                            isToday
                              ? day.trained ? 'bg-white' : 'bg-[#222] ring-1 ring-white/20'
                              : day.trained
                                ? 'bg-white/80'
                                : 'bg-[#111]'
                          }`}
                        />
                      )
                    })}
                  </div>
                ))}
                <div className="flex gap-1 mt-1">
                  {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(d => (
                    <p key={d} className="flex-1 text-center text-[9px] text-[#333] font-mono">{d}</p>
                  ))}
                </div>
              </div>
            </div>

            {sessions.length > 0 && (
              <div>
                <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-3">
                  Últimas sesiones
                </p>
                <div className="space-y-2">
                  {sessions.slice(0, 6).map(s => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 bg-[#111] border border-[#1a1a1a] rounded-xl">
                      <div>
                        <p className="font-semibold text-sm">{s.workoutName}</p>
                        <p className="text-[#555] text-xs">
                          {new Date(s.endedAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <p className="font-mono text-xs text-[#666]">{s.totalVolume.toLocaleString()} kg</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RANGOS ───────────────────────────────────── */}
        {tab === 'rangos' && (
          <div className="space-y-2">
            {muscleVolumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[#444] font-semibold">Sin datos aún</p>
                <p className="text-[#333] text-sm mt-1">Completa sesiones para ver tus rangos</p>
              </div>
            ) : (
              muscleVolumes.map(mv => {
                const colors = RANK_COLORS[mv.rank]
                return (
                  <div
                    key={mv.muscle}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border ${colors.bg} ${colors.border}`}
                  >
                    <div>
                      <p className={`font-bold text-sm ${colors.text}`}>{mv.muscle}</p>
                      <p className="text-[#555] text-xs font-mono mt-0.5">
                        {mv.totalVolume.toLocaleString()} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg leading-none">{RANK_EMOJI[mv.rank]}</p>
                      <p className={`text-xs font-bold mt-1 ${colors.text}`}>{mv.rank}</p>
                    </div>
                  </div>
                )
              })
            )}

            <div className="mt-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 space-y-2">
              <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-3">Sistema de rangos</p>
              {[
                { emoji: '🥉', rank: 'Bronce',    vol: '0 kg' },
                { emoji: '🥈', rank: 'Plata',     vol: '1,000 kg' },
                { emoji: '🥇', rank: 'Oro',       vol: '5,000 kg' },
                { emoji: '💎', rank: 'Platino',   vol: '20,000 kg' },
                { emoji: '💚', rank: 'Esmeralda', vol: '60,000 kg' },
                { emoji: '👑', rank: 'Simétrico', vol: '150,000 kg' },
              ].map(r => (
                <div key={r.rank} className="flex items-center gap-3">
                  <span className="text-base w-6">{r.emoji}</span>
                  <span className="text-sm font-semibold text-[#888] flex-1">{r.rank}</span>
                  <span className="font-mono text-xs text-[#444]">{r.vol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TOBILLO ──────────────────────────────────── */}
        {tab === 'tobillo' && (
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-[#555] text-xs leading-relaxed">
                Párate en un pie con ojos cerrados. Mide cuántos segundos aguantas sin apoyar el otro pie ni mover los brazos.
              </p>
            </div>

            <button
              onClick={() => setShowAnkleForm(v => !v)}
              className="w-full h-11 border border-dashed border-[#222] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#444] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Registrar test
            </button>

            {showAnkleForm && (
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 space-y-3">
                <div className="flex gap-2">
                  {(['left', 'right'] as const).map(side => (
                    <button
                      key={side}
                      onClick={() => setASide(side)}
                      className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${
                        aSide === side ? 'bg-white text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#555]'
                      }`}
                    >
                      {side === 'left' ? 'Pie izq.' : 'Pie der.'}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1">Segundos</label>
                  <input
                    type="number"
                    value={aSeconds}
                    onChange={e => setASeconds(e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 text-base font-mono font-bold focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAnkleForm(false)} className="flex-1 h-10 border border-[#222] rounded-lg text-[#666] text-sm">Cancelar</button>
                  <button onClick={addAnkleTest} disabled={!aSeconds} className="flex-1 h-10 bg-white text-black rounded-lg text-sm font-bold disabled:opacity-30">Guardar</button>
                </div>
              </div>
            )}

            {ankleTests.length > 0 && (
              <div className="space-y-2">
                {ankleTests.map((t, i) => {
                  const prev = ankleTests[i + 1]
                  const diff = prev ? t.seconds - prev.seconds : null
                  return (
                    <div key={t.id} className="flex items-center justify-between px-4 py-3 bg-[#111] border border-[#1a1a1a] rounded-xl">
                      <div>
                        <p className="font-mono text-2xl font-bold">{t.seconds}s</p>
                        <p className="text-[#555] text-xs mt-0.5">
                          {t.side === 'left' ? 'Pie izq.' : 'Pie der.'} · {new Date(t.date + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {diff !== null && (
                          <div className={`flex items-center gap-1 text-xs font-mono ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-[#555]'}`}>
                            {diff > 0 ? <TrendingUp size={12} /> : diff < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                            {diff > 0 ? '+' : ''}{diff}s
                          </div>
                        )}
                        <button onClick={() => removeAnkleTest(t.id)} className="text-[#333] hover:text-red-500 transition-colors p-1">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CUERPO ───────────────────────────────────── */}
        {tab === 'cuerpo' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowBodyForm(v => !v)}
              className="w-full h-11 border border-dashed border-[#222] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#444] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Registrar medición
            </button>

            {showBodyForm && (
              <div className="bg-[#111] border border-[#222] rounded-xl p-4 space-y-3">
                {[
                  { label: 'Peso (kg)', value: bWeight, set: setBWeight },
                  { label: 'Grasa (%)', value: bFat, set: setBFat },
                  { label: 'Músculo (%)', value: bMuscle, set: setBMuscle },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1">{label}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={e => set(e.target.value)}
                      inputMode="decimal"
                      placeholder="—"
                      className="w-full h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 text-base font-mono font-bold focus:outline-none focus:border-white/30"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setShowBodyForm(false)} className="flex-1 h-10 border border-[#222] rounded-lg text-[#666] text-sm">Cancelar</button>
                  <button
                    onClick={addBodyStat}
                    disabled={!bWeight && !bFat && !bMuscle}
                    className="flex-1 h-10 bg-white text-black rounded-lg text-sm font-bold disabled:opacity-30"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {bodyStats.length === 0 && !showBodyForm && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-[#444] font-semibold">Sin datos</p>
                <p className="text-[#333] text-sm mt-1">Registra tu primera medición</p>
              </div>
            )}

            <div className="space-y-2">
              {bodyStats.map((s, i) => {
                const prev = bodyStats[i + 1]
                return (
                  <div key={s.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[#555] text-xs">
                        {new Date(s.date + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <button onClick={() => removeBodyStat(s.id)} className="text-[#333] hover:text-red-500 transition-colors p-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Peso', value: s.weight, unit: 'kg', prev: prev?.weight },
                        { label: 'Grasa', value: s.fat, unit: '%', prev: prev?.fat },
                        { label: 'Músculo', value: s.muscle, unit: '%', prev: prev?.muscle },
                      ].map(({ label, value, unit, prev: pv }) => {
                        if (value === undefined) return null
                        const diff = pv !== undefined ? value - pv : null
                        return (
                          <div key={label} className="text-center">
                            <p className="font-mono font-bold text-lg">{value}{unit}</p>
                            <p className="text-[#555] text-[10px]">{label}</p>
                            {diff !== null && (
                              <p className={`text-[10px] font-mono mt-0.5 ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-emerald-400' : 'text-[#444]'}`}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
