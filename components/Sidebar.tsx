'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  CalendarDays, LayoutDashboard, BookOpen,
  Clock, BarChart2, Settings, Sun, MoreHorizontal, CheckSquare, Loader2, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard/today',     label: 'Today',     Icon: Sun },
  { href: '/dashboard/calendar',  label: 'Calendar',  Icon: CalendarDays },
  { href: '/dashboard/overview',  label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/dashboard/subjects',  label: 'Subjects',  Icon: BookOpen },
  { href: '/dashboard/timetable', label: 'Timetable', Icon: Clock },
  { href: '/dashboard/todos',     label: 'Tasks',     Icon: CheckSquare },
  { href: '/dashboard/reports',   label: 'Reports',   Icon: BarChart2 },
  { href: '/dashboard/settings',  label: 'Settings',  Icon: Settings },
]

const ADMIN_NAV = { href: '/dashboard/admin', label: 'Admin', Icon: ShieldCheck }

interface Props { semesterName?: string | null; isAdmin?: boolean }

export function Sidebar({ semesterName, isAdmin }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => { setPending(null) }, [pathname])

  function navigate(href: string) {
    if (pathname === href) return
    setPending(href)
    router.push(href)
  }

  const allNav = isAdmin ? [...NAV, ADMIN_NAV] : NAV

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col bg-white dark:bg-[#1A1A1A] border-r border-[#EBEBEB] dark:border-[#2A2A2A] h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <img src="/icon.svg" alt="" className="w-[28px] h-[28px] rounded-[7px]" />
        <div>
          <span className="text-[16px] font-[500] text-[#111111] dark:text-[#F0F0F0] tracking-tight">AttendEase</span>
          {semesterName && (
            <p className="text-[12px] text-[#ABABAB] dark:text-[#606060] truncate">{semesterName}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {allNav.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          const loading = pending === href
          const isAdminTab = href === '/dashboard/admin'
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] transition-colors duration-150 text-left',
                active
                  ? isAdminTab
                    ? 'bg-[rgba(220,38,38,0.08)] dark:bg-[rgba(248,113,113,0.1)] text-[#DC2626] dark:text-[#F87171] font-[500]'
                    : 'bg-[rgba(91,91,214,0.12)] dark:bg-[rgba(123,127,232,0.15)] text-[#5B5BD6] dark:text-[#7B7FE8] font-[500]'
                  : loading
                  ? 'bg-[rgba(91,91,214,0.06)] text-[#5B5BD6] dark:text-[#7B7FE8]'
                  : 'text-[#6B6B6B] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-[#F0F0F0] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.05)]'
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

interface BottomTabBarProps { isAdmin?: boolean }

export function BottomTabBar({ isAdmin }: BottomTabBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

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

  const moreItems = isAdmin ? [...MORE_ITEMS, { href: '/dashboard/admin', label: 'Admin', Icon: ShieldCheck }] : MORE_ITEMS
  const moreActive = moreItems.some(({ href }) => pathname === href || pathname.startsWith(href + '/'))
  const morePending = moreItems.some(({ href }) => pending === href)

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      {/* Floating pill */}
      <div
        ref={ref}
        className="pointer-events-auto relative flex items-center gap-0.5 rounded-full px-2 py-1.5"
        style={isDark ? {
          background: 'rgba(30, 30, 30, 0.88)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        } : {
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
              style={active ? { background: 'rgba(91, 91, 214, 0.12)' } : undefined}
            >
              {loading
                ? <Loader2 size={20} className="animate-spin text-[#5B5BD6] dark:text-[#7B7FE8]" />
                : <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.7}
                    className={active ? 'text-[#5B5BD6] dark:text-[#7B7FE8]' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'}
                  />
              }
              <span className={cn(
                'text-[10px] font-[500] leading-none',
                active || loading ? 'text-[#5B5BD6] dark:text-[#7B7FE8]' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'
              )}>
                {label}
              </span>
            </button>
          )
        })}

        {/* Divider */}
        <div className="w-px h-7 bg-black/[0.07] dark:bg-white/[0.08] mx-1 rounded-full shrink-0" />

        {/* More button */}
        <button
          onClick={() => setOpen(v => !v)}
          className="relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-full transition-all duration-200 min-w-[64px]"
          style={open || moreActive ? {
            background: isDark ? 'rgba(123,127,232,0.18)' : 'rgba(91, 91, 214, 0.12)',
          } : undefined}
        >
          {morePending
            ? <Loader2 size={20} className="animate-spin text-[#5B5BD6] dark:text-[#7B7FE8]" />
            : <MoreHorizontal
                size={20}
                strokeWidth={open || moreActive ? 2.2 : 1.7}
                className={open || moreActive ? 'text-[#5B5BD6] dark:text-[#7B7FE8]' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'}
              />
          }
          <span className={cn(
            'text-[10px] font-[500] leading-none',
            open || moreActive || morePending ? 'text-[#5B5BD6] dark:text-[#7B7FE8]' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'
          )}>
            More
          </span>
        </button>

        {/* More popup */}
        {open && (
          <div
            className="absolute bottom-[calc(100%+10px)] right-0 rounded-[18px] py-2 min-w-[180px] overflow-hidden"
            style={isDark ? {
              background: 'rgba(28, 28, 28, 0.96)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            } : {
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.55)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {moreItems.map(({ href, label, Icon }, idx) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              const loading = pending === href
              const isAdminItem = href === '/dashboard/admin'
              return (
                <button
                  key={href}
                  onClick={() => navigate(href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-[450] transition-colors text-left',
                    idx < moreItems.length - 1 ? 'border-b border-black/[0.05] dark:border-white/[0.05]' : '',
                    active || loading
                      ? isAdminItem ? 'text-[#DC2626] dark:text-[#F87171]' : 'text-[#5B5BD6] dark:text-[#7B7FE8]'
                      : 'text-[#111111] dark:text-[#F0F0F0]'
                  )}
                >
                  {loading
                    ? <Loader2 size={16} className="animate-spin shrink-0 text-[#5B5BD6] dark:text-[#7B7FE8]" />
                    : <Icon
                        size={16}
                        strokeWidth={active ? 2.2 : 1.7}
                        className={
                          active || loading
                            ? isAdminItem ? 'text-[#DC2626] dark:text-[#F87171]' : 'text-[#5B5BD6] dark:text-[#7B7FE8]'
                            : isAdminItem ? 'text-[#DC2626] dark:text-[#F87171]' : 'text-[#6B6B6B] dark:text-[#A0A0A0]'
                        }
                      />
                  }
                  {label}
                  {active && (
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${isAdminItem ? 'bg-[#DC2626]' : 'bg-[#5B5BD6] dark:bg-[#7B7FE8]'}`} />
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
