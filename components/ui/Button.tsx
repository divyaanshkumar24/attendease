import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-[#5B5BD6] dark:bg-[#7B7FE8] text-white hover:bg-[#4949b8] dark:hover:bg-[#6567d4] active:bg-[#3b3b9e]',
  secondary: 'bg-white dark:bg-[#242424] border border-[#EBEBEB] dark:border-[#2A2A2A] text-[#111111] dark:text-[#F0F0F0] hover:bg-[#FAFAFA] dark:hover:bg-[#2E2E2E] active:bg-[#F0F0F0] dark:active:bg-[#333]',
  danger:    'bg-white dark:bg-[#242424] border border-[#EBEBEB] dark:border-[#2A2A2A] text-[#DC2626] dark:text-[#F87171] hover:bg-[rgba(220,38,38,0.06)] dark:hover:bg-[rgba(248,113,113,0.08)]',
  ghost:     'text-[#6B6B6B] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-[#F0F0F0] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)]',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-[500] rounded-[8px] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        size === 'md' ? 'px-4 py-2 text-[14px]' : 'px-3 py-1.5 text-[13px]',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </button>
  )
}
