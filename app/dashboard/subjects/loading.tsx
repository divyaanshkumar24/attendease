import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function SubjectsLoading() {
  return (
    <div className="max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28 rounded-[8px]" />
      </div>

      {/* Subject cards */}
      {[1,2,3,4,5].map(i => (
        <SkeletonCard key={i} className="flex items-center gap-4">
          <Skeleton className="w-3 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-[6px]" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  )
}
