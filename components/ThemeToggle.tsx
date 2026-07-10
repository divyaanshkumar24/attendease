'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={`w-8 h-8 ${className ?? ''}`} />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`w-8 h-8 flex items-center justify-center rounded-[8px] text-[#6B6B6B] dark:text-[#A0A0A0] hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] transition-colors duration-150 ${className ?? ''}`}
      title="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
    </button>
  )
}
