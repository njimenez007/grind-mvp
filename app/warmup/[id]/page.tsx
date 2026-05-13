'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Play, Pause, SkipForward } from 'lucide-react'

const WARMUP_SECONDS = 8 * 60

export default function WarmupPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [seconds, setSeconds] = useState(WARMUP_SECONDS)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            router.push(`/session/${id}`)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, id, router])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = seconds / WARMUP_SECONDS

  return (
    <div className="flex flex-col min-h-dvh bg-black items-center justify-center px-6 text-center">
      <p className="text-[#888] text-xs font-medium tracking-widest uppercase mb-12">Calentamiento</p>

      {/* Timer ring */}
      <div className="relative w-52 h-52 mb-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#1a1a1a" strokeWidth="4" />
          <circle
            cx="100" cy="100" r="88"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-6xl font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setRunning(r => !r)}
          className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          {running ? <Pause size={26} fill="black" /> : <Play size={26} fill="black" className="ml-1" />}
        </button>

        <button
          onClick={() => router.push(`/session/${id}`)}
          className="flex items-center gap-2 text-[#888] hover:text-white transition-colors text-sm font-medium"
        >
          <SkipForward size={16} />
          Saltar
        </button>
      </div>
    </div>
  )
}
