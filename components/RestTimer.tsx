'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { playRestEndSound } from '@/lib/utils'

interface Props {
  seconds: number
  total: number
  onSkip: () => void
  onEnd: () => void
}

export default function RestTimer({ seconds, total, onSkip, onEnd }: Props) {
  const endFiredRef = useRef(false)

  useEffect(() => {
    endFiredRef.current = false
  }, [total])

  useEffect(() => {
    if (seconds <= 0 && !endFiredRef.current) {
      endFiredRef.current = true
      try { navigator.vibrate([200, 100, 200]) } catch {}
      playRestEndSound()
      const t = setTimeout(onEnd, 800)
      return () => clearTimeout(t)
    }
  }, [seconds, onEnd])

  const progress = total > 0 ? seconds / total : 0
  const circumference = 2 * Math.PI * 54

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center px-6">
      <p className="text-[#888] text-xs font-medium tracking-widest uppercase mb-8">Descanso</p>

      <div className="relative w-40 h-40 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#222" strokeWidth="4" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-5xl font-bold tabular-nums">
            {String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <button
        onClick={onSkip}
        className="flex items-center gap-2 text-[#888] hover:text-white transition-colors text-sm font-medium"
      >
        <X size={16} />
        Saltar descanso
      </button>
    </div>
  )
}
