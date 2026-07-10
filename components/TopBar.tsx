'use client'

import { usePathname } from 'next/navigation'
import { Button } from './ui/Button'
import { CalendarCheck } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard/today':     'Today',
  '/dashboard/calendar':  'Calendar',
  '/dashboard/overview':  'Dashboard',
  '/dashboard/subjects':  'Subjects',
  '/dashboard/timetable': 'Timetable',
  '/dashboard/reports':   'Reports',
  '/dashboard/todos':     'Tasks',
  '/dashboard/settings':  'Settings',
}

interface Props {
  semesterName?: string | null
  hasUnmarkedToday?: boolean
  onMarkToday?: () => void
}

export function TopBar({ semesterName, hasUnmarkedToday, onMarkToday }: Props) {
  const pathname = usePathname()

  const titleKey = Object.keys(PAGE_TITLES)
    .filter(k => pathname === k || pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0]

  const title = PAGE_TITLES[titleKey ?? ''] ?? ''

  return (
    <header className="h-[56px] shrink-0 flex items-center justify-between px-6 bg-white dark:bg-[#1A1A1A] border-b border-[#EBEBEB] dark:border-[#2A2A2A]">
      <div className="flex items-center gap-2.5">
        <img src="/icon.svg" alt="" className="md:hidden w-[26px] h-[26px] rounded-[6px]" />
        <h1 className="text-[15px] font-[500] text-[#111111] dark:text-[#F0F0F0]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {semesterName && (
          <span className="hidden sm:inline text-[12px] text-[#ABABAB] dark:text-[#606060] bg-[#FAFAFA] dark:bg-[#0F0F0F] border border-[#EBEBEB] dark:border-[#2A2A2A] rounded-[6px] px-2.5 py-1">
            {semesterName}
          </span>
        )}
        {hasUnmarkedToday && (
          <Button size="sm" onClick={onMarkToday} className="gap-1.5">
            <CalendarCheck size={14} />
            Mark today
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
