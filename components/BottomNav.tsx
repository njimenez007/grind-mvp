'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, Dumbbell, BarChart2, Target, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',          icon: Home,     label: 'Inicio' },
  { href: '/exercises', icon: Dumbbell, label: 'Ejercicios' },
  { href: '/stats',     icon: BarChart2, label: 'Stats' },
  { href: '/goals',     icon: Target,   label: 'Objetivos' },
  { href: '/routine',   icon: Settings, label: 'Rutina' },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-[#1a1a1a] bg-black/95 backdrop-blur-sm z-40"
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
                active ? 'text-white' : 'text-[#444] hover:text-[#888]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[9px] uppercase tracking-widest font-medium ${active ? 'text-white' : 'text-[#444]'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
