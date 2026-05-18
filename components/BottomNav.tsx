'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, Dumbbell, BarChart2, Flame, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',             icon: Home,     label: 'Hoy' },
  { href: '/routine',      icon: Dumbbell, label: 'Rutinas' },
  { href: '/stats',        icon: BarChart2, label: 'Progreso' },
  { href: '/goals',        icon: Flame,    label: 'Hábitos' },
  { href: '/notifications', icon: User,    label: 'Perfil' },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-sm z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`flex flex-col items-center py-3 gap-1 transition-colors active:scale-95 ${
                active ? 'text-white' : 'text-[#444] hover:text-[#8A8A8A]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[9px] uppercase tracking-[0.12em] font-medium ${
                active ? 'text-white' : 'text-[#444]'
              }`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
