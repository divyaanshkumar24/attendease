import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function OverviewLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Semester progress bar */}
      <SkeletonCard>
        <div className="flex justify-between mb-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </SkeletonCard>

      {/* Subject cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <SkeletonCard key={i} className="flex items-center gap-4">
            {/* Progress ring placeholder */}
            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
              {/* Sparkline */}
              <div className="flex items-end gap-1 mt-2">
                <Skeleton className="w-5 h-4 rounded-[2px]" />
                <Skeleton className="w-5 h-6 rounded-[2px]" />
                <Skeleton className="w-5 h-5 rounded-[2px]" />
                <Skeleton className="w-5 h-8 rounded-[2px]" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* What-if calculator */}
      <SkeletonCard>
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-8 w-full rounded-[8px] mb-4" />
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-[8px]" />
          <Skeleton className="h-16 rounded-[8px]" />
        </div>
      </SkeletonCard>
    </div>
  )
}
