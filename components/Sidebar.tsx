'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  CalendarDays, LayoutDashboard, BookOpen,
  Clock, BarChart2, Settings, Sun, MoreHorizontal, CheckSquare, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard/today',     label: 'Today',     Icon: Sun },
  { href: '/dashboard/calendar',  label: 'Calendar',  Icon: CalendarDays },
  { href: '/dashboard/overview',  label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/dashboard/subjects',  label: 'Subjects',  Icon: BookOpen },
  { href: '/dashboard/timetable', label: 'Timetable',  Icon: Clock },
  { href: '/dashboard/todos',     label: 'Tasks',      Icon: CheckSquare },
  { href: '/dashboard/reports',   label: 'Reports',    Icon: BarChart2 },
  { href: '/dashboard/settings',  label: 'Settings',   Icon: Settings },
]

interface Props { semesterName?: string | null }

export function Sidebar({ semesterName }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)

  // Clear pending when pathname actually changes
  useEffect(() => { setPending(null) }, [pathname])

  function navigate(href: string) {
    if (pathname === href) return
    setPending(href)
    router.push(href)
  }

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col bg-white border-r border-[#EBEBEB] h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <img src="/icon.svg" alt="" className="w-[28px] h-[28px] rounded-[7px]" />
        <div>
          <span className="text-[16px] font-[500] text-[#111111] tracking-tight">AttendEase</span>
          {semesterName && (
            <p className="text-[12px] text-[#ABABAB] truncate">{semesterName}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          const loading = pending === href
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] transition-colors duration-150 text-left',
                active
                  ? 'bg-[rgba(91,91,214,0.08)] text-[#5B5BD6] font-[500]'
                  : loading
                  ? 'bg-[rgba(91,91,214,0.05)] text-[#5B5BD6]'
                  : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.04)]'
              )}
            >
              {loading
                ? <Loader2 size={16} className="animate-spin shrink-0" />
                : <Icon size={16} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
              }
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

// Mobile bottom tab bar
const MOBILE_TABS = [
  { href: '/dashboard/today',    label: 'Today',    Icon: Sun },
  { href: '/dashboard/calendar', label: 'Calendar', Icon: CalendarDays },
  { href: '/dashboard/overview', label: 'Dashboard', Icon: LayoutDashboard },
]

const MORE_ITEMS = [
  { href: '/dashboard/timetable', label: 'Timetable', Icon: Clock },
  { href: '/dashboard/todos',     label: 'Tasks',     Icon: CheckSquare },
  { href: '/dashboard/subjects',  label: 'Subjects',  Icon: BookOpen },
  { href: '/dashboard/reports',   label: 'Reports',   Icon: BarChart2 },
  { href: '/dashboard/settings',  label: 'Settings',  Icon: Settings },
]

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setPending(null); setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function navigate(href: string) {
    if (pathname === href) return
    setPending(href)
    setOpen(false)
    router.push(href)
  }

  const moreActive = MORE_ITEMS.some(({ href }) => pathname === href || pathname.startsWith(href + '/'))
  const morePending = MORE_ITEMS.some(({ href }) => pending === href)

  return (
    // Outer wrapper — pointer-events-none so page scroll works through empty space
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      {/* Floating pill */}
      <div
        ref={ref}
        className="pointer-events-auto relative flex items-center gap-0.5 rounded-full px-2 py-1.5"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.55)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* Main tabs */}
        {MOBILE_TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          const loading = pending === href
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all duration-200 min-w-[64px]"
              style={active ? {
                background: 'rgba(91, 91, 214, 0.12)',
              } : undefined}
            >
              {loading
                ? <Loader2 size={20} className="animate-spin text-[#5B5BD6]" />
                : <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.7}
                    className={active ? 'text-[#5B5BD6]' : 'text-[#6B6B6B]'}
                  />
              }
              <span className={cn(
                'text-[10px] font-[500] leading-none',
                active || loading ? 'text-[#5B5BD6]' : 'text-[#6B6B6B]'
              )}>
                {label}
              </span>
            </button>
          )
        })}

        {/* Divider */}
        <div className="w-px h-7 bg-black/[0.07] mx-1 rounded-full shrink-0" />

        {/* More button */}
        <button
          onClick={() => setOpen(v => !v)}
          className="relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all duration-200 min-w-[64px]"
          style={open || moreActive ? {
            background: 'rgba(91, 91, 214, 0.12)',
          } : undefined}
        >
          {morePending
            ? <Loader2 size={20} className="animate-spin text-[#5B5BD6]" />
            : <MoreHorizontal
                size={20}
                strokeWidth={open || moreActive ? 2.2 : 1.7}
                className={open || moreActive ? 'text-[#5B5BD6]' : 'text-[#6B6B6B]'}
              />
          }
          <span className={cn(
            'text-[10px] font-[500] leading-none',
            open || moreActive || morePending ? 'text-[#5B5BD6]' : 'text-[#6B6B6B]'
          )}>
            More
          </span>
        </button>

        {/* More popup — glass style, floats above pill */}
        {open && (
          <div
            className="absolute bottom-[calc(100%+10px)] right-0 rounded-[18px] py-2 min-w-[180px] overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.55)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {MORE_ITEMS.map(({ href, label, Icon }, idx) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              const loading = pending === href
              return (
                <button
                  key={href}
                  onClick={() => navigate(href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-[450] transition-colors text-left',
                    idx < MORE_ITEMS.length - 1 ? 'border-b border-black/[0.05]' : '',
                    active ? 'text-[#5B5BD6]' : loading ? 'text-[#5B5BD6]' : 'text-[#111111]'
                  )}
                >
                  {loading
                    ? <Loader2 size={16} className="animate-spin shrink-0 text-[#5B5BD6]" />
                    : <Icon
                        size={16}
                        strokeWidth={active ? 2.2 : 1.7}
                        className={active || loading ? 'text-[#5B5BD6]' : 'text-[#6B6B6B]'}
                      />
                  }
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5B5BD6] shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
