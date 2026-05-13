'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getSessions } from '@/lib/storage'
import { Session } from '@/lib/types'
import { formatTime } from '@/lib/utils'

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    setSessions(getSessions())
  }, [])

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Historial</h1>
      </div>

      <div className="flex-1 px-4 space-y-2 pb-8">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#444]">
            <p className="text-sm">Sin sesiones todavía</p>
            <p className="text-xs mt-1">Completá tu primer entreno</p>
          </div>
        ) : (
          sessions.map(session => {
            const date = new Date(session.startedAt)
            const dateStr = date.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })

            return (
              <div key={session.id} className="bg-[#111] border border-[#222] rounded-xl px-4 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-base">{session.workoutName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#555] font-mono">
                    <span>{dateStr}</span>
                    <span>{formatTime(session.durationSeconds)}</span>
                    <span>{session.totalSets} series</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sm">{session.totalVolume.toLocaleString()}</p>
                  <p className="text-xs text-[#555]">kg totales</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
