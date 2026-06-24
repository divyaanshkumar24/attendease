import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-[6px] bg-[#EBEBEB]', className)} />
  )
}

export function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn('bg-white border border-[#EBEBEB] rounded-[10px] p-4', className)}>
      {children}
    </div>
  )
}
