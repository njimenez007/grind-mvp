'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, Square, Camera, X, ChevronDown, ChevronUp } from 'lucide-react'
import { saveSession, savePostWorkoutNote } from '@/lib/storage'
import { Session, CompletedExercise, ActiveExercise } from '@/lib/types'
import { formatTime } from '@/lib/utils'

interface PendingSession {
  id: string
  workoutId: string
  workoutName: string
  startedAt: number
  elapsed: number
  exercises: ActiveExercise[]
}

export default function CompletePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [saved, setSaved] = useState(false)
  const [showNote, setShowNote] = useState(false)

  // Note state
  const [noteText, setNoteText] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [voiceDataUrl, setVoiceDataUrl] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('pending_session')
    if (!raw) { router.push('/'); return }
    const pending: PendingSession = JSON.parse(raw)

    const completedExercises: CompletedExercise[] = pending.exercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      muscle: ex.muscle,
      sets: ex.sets
        .filter(s => s.completed)
        .map(s => ({
          reps: Number(s.reps) || 0,
          weight: Number(s.weight) || 0,
          completedAt: s.completedAt ?? Date.now(),
        })),
    })).filter(ex => ex.sets.length > 0)

    const totalSets = completedExercises.reduce((acc, ex) => acc + ex.sets.length, 0)
    const totalVolume = completedExercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((a, s) => a + s.reps * s.weight, 0),
      0
    )

    setSession({
      id: pending.id,
      workoutId: pending.workoutId,
      workoutName: pending.workoutName,
      startedAt: pending.startedAt,
      endedAt: Date.now(),
      durationSeconds: pending.elapsed,
      exercises: completedExercises,
      totalSets,
      totalVolume,
    })
  }, [router])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => setVoiceDataUrl(reader.result as string)
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start()
      setIsRecording(true)
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => {
          if (s >= 29) { stopRecording(); return 30 }
          return s + 1
        })
      }, 1000)
    } catch {
      alert('No se pudo acceder al micrófono.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 800
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.65))
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  function handleSave() {
    if (!session || saved) return
    saveSession(session)
    const hasNote = noteText.trim() || photoDataUrl || voiceDataUrl
    if (hasNote) {
      savePostWorkoutNote({
        sessionId: session.id,
        text: noteText.trim() || undefined,
        photoDataUrl: photoDataUrl ?? undefined,
        voiceDataUrl: voiceDataUrl ?? undefined,
        savedAt: Date.now(),
      })
    }
    setSaved(true)
    sessionStorage.removeItem('pending_session')
  }

  if (!session) return null

  return (
    <div className="flex flex-col min-h-dvh bg-black px-5 pt-16 pb-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-[#555] text-xs tracking-widest uppercase mb-3">Entreno completado</p>
        <h1 className="text-4xl font-black tracking-tight mb-2">{session.workoutName}</h1>

        <p className="font-mono text-6xl font-bold tabular-nums mt-8 mb-10">
          {formatTime(session.durationSeconds)}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {[
            { value: session.exercises.length, label: 'ejercicios' },
            { value: session.totalSets, label: 'series' },
            { value: session.totalVolume.toLocaleString(), label: 'kg vol.' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
              <p className="font-mono text-2xl font-bold">{value}</p>
              <p className="text-[#555] text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Exercise breakdown */}
        <div className="w-full space-y-2 mb-6">
          {session.exercises.map(ex => (
            <div key={ex.exerciseId} className="flex items-center justify-between px-4 py-3 bg-[#111] border border-[#1a1a1a] rounded-xl">
              <div className="text-left">
                <p className="font-medium text-sm">{ex.name}</p>
                <p className="text-[#555] text-xs">{ex.muscle}</p>
              </div>
              <span className="font-mono text-xs text-[#666]">{ex.sets.length} series</span>
            </div>
          ))}
        </div>

        {/* Post-workout note */}
        <div className="w-full">
          <button
            onClick={() => setShowNote(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-dashed border-[#222] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#444] transition-colors"
          >
            <span>Nota post-entreno</span>
            {showNote ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showNote && (
            <div className="mt-3 space-y-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
              {/* Text note */}
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="¿Cómo te sentiste? ¿Algo que ajustar?"
                rows={3}
                className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-white/30 placeholder:text-[#333]"
              />

              {/* Photo */}
              <div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhoto}
                />
                {photoDataUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoDataUrl} alt="Post-workout" className="w-full rounded-lg max-h-40 object-cover" />
                    <button
                      onClick={() => setPhotoDataUrl(null)}
                      className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full h-10 border border-[#222] rounded-lg flex items-center justify-center gap-2 text-[#555] text-sm hover:text-white hover:border-[#444] transition-colors"
                  >
                    <Camera size={14} /> Agregar foto
                  </button>
                )}
              </div>

              {/* Voice note */}
              <div>
                {voiceDataUrl ? (
                  <div className="flex items-center gap-2">
                    <audio src={voiceDataUrl} controls className="flex-1 h-8" style={{ filter: 'invert(1)' }} />
                    <button onClick={() => setVoiceDataUrl(null)} className="text-[#555] hover:text-white p-1">
                      <X size={14} />
                    </button>
                  </div>
                ) : isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="w-full h-10 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center gap-2 text-red-400 text-sm"
                  >
                    <Square size={12} fill="currentColor" /> Detener ({30 - recordingSeconds}s)
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="w-full h-10 border border-[#222] rounded-lg flex items-center justify-center gap-2 text-[#555] text-sm hover:text-white hover:border-[#444] transition-colors"
                  >
                    <Mic size={14} /> Grabar nota de voz (máx. 30s)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full h-14 font-bold text-base rounded-xl tracking-wide transition-all active:scale-[0.98] ${
            saved
              ? 'bg-[#1a1a1a] text-[#555] border border-[#222]'
              : 'bg-white text-black hover:bg-[#eee]'
          }`}
        >
          {saved ? 'Guardado ✓' : 'Guardar sesión'}
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full h-12 text-[#888] font-medium text-sm hover:text-white transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
