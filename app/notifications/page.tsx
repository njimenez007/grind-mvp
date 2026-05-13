'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, BellOff, Flame, Trophy, Check } from 'lucide-react'
import { getNotificationSettings, saveNotificationSettings } from '@/lib/storage'
import { NotificationSettings } from '@/lib/types'
import BottomNav from '@/components/BottomNav'

export default function NotificationsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<NotificationSettings>({
    reminderEnabled: false,
    reminderTime: '07:00',
    streakAlerts: true,
    rankAlerts: true,
  })
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [testSent, setTestSent] = useState(false)

  useEffect(() => {
    setSettings(getNotificationSettings())
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    }
  }, [])

  function update(patch: Partial<NotificationSettings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveNotificationSettings(next)
  }

  async function requestPermission() {
    if (typeof Notification === 'undefined') return
    const perm = await Notification.requestPermission()
    setPermission(perm)
  }

  function sendTest() {
    if (permission !== 'granted') return
    new Notification('GRIND 🏋️', {
      body: 'Notificaciones activas. ¡A entrenar!',
      icon: '/icon-192.png',
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-white' : 'bg-[#222]'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${enabled ? 'bg-black translate-x-5' : 'bg-[#555] translate-x-0.5'}`} />
    </button>
  )

  return (
    <div className="flex flex-col min-h-dvh bg-black">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => router.back()} className="text-[#888] hover:text-white transition-colors p-1 -ml-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Notificaciones</h1>
      </div>

      <div className="flex-1 px-4 pb-28 space-y-4 overflow-y-auto">

        {/* Browser permission */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            {permission === 'granted'
              ? <Bell size={18} className="text-emerald-400" />
              : <BellOff size={18} className="text-[#555]" />
            }
            <div>
              <p className="font-semibold text-sm">Permiso del navegador</p>
              <p className="text-[#555] text-xs mt-0.5">
                {permission === 'granted' && 'Activado'}
                {permission === 'denied' && 'Bloqueado — actívalo en ajustes del navegador'}
                {permission === 'default' && 'Sin activar'}
              </p>
            </div>
          </div>

          {permission !== 'granted' && permission !== 'denied' && (
            <button
              onClick={requestPermission}
              className="w-full h-10 bg-white text-black rounded-lg text-sm font-bold active:scale-[0.98] transition-transform"
            >
              Activar notificaciones
            </button>
          )}

          {permission === 'granted' && (
            <button
              onClick={sendTest}
              className="w-full h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#888] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              {testSent ? <><Check size={14} className="text-emerald-400" /> Enviado</> : 'Enviar notificación de prueba'}
            </button>
          )}
        </div>

        {/* Daily reminder */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-[#888]" />
              <div>
                <p className="font-semibold text-sm">Recordatorio diario</p>
                <p className="text-[#555] text-xs mt-0.5">Aviso antes de entrenar</p>
              </div>
            </div>
            <Toggle enabled={settings.reminderEnabled} onChange={v => update({ reminderEnabled: v })} />
          </div>

          {settings.reminderEnabled && (
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-2">Hora</label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={e => update({ reminderTime: e.target.value })}
                className="h-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 font-mono text-base font-bold focus:outline-none focus:border-white/30 [color-scheme:dark]"
              />
              {permission !== 'granted' && (
                <p className="text-[#444] text-xs mt-2">Activa el permiso del navegador para recibir este recordatorio.</p>
              )}
            </div>
          )}
        </div>

        {/* Streak alert */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame size={16} className="text-orange-400" />
              <div>
                <p className="font-semibold text-sm">Alerta de racha</p>
                <p className="text-[#555] text-xs mt-0.5">Aviso si tu racha está en riesgo</p>
              </div>
            </div>
            <Toggle enabled={settings.streakAlerts} onChange={v => update({ streakAlerts: v })} />
          </div>
        </div>

        {/* Rank alert */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={16} className="text-yellow-400" />
              <div>
                <p className="font-semibold text-sm">Subida de rango</p>
                <p className="text-[#555] text-xs mt-0.5">Notificación al subir de rango muscular</p>
              </div>
            </div>
            <Toggle enabled={settings.rankAlerts} onChange={v => update({ rankAlerts: v })} />
          </div>
        </div>

        <p className="text-[#333] text-xs px-1 leading-relaxed">
          Las notificaciones en segundo plano requieren que la app esté instalada como PWA y que el permiso del navegador esté activo. Las alertas de racha y rango se activan al abrir la app.
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
