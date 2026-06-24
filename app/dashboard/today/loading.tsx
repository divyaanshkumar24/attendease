import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function TodayLoading() {
  return (
    <div className="max-w-2xl space-y-5">
      {/* Header bar */}
      <SkeletonCard className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-24 rounded-[8px]" />
      </SkeletonCard>

      {/* Overall stats bar */}
      <SkeletonCard>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex gap-4 mt-3">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Lecture cards */}
      <div className="space-y-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white border border-[#EBEBEB] rounded-[10px] flex overflow-hidden">
            <div className="w-1 bg-[#EBEBEB] shrink-0 animate-pulse" />
            <div className="flex-1 px-3.5 py-3 flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-8 rounded-[3px]" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="w-8 h-8 rounded-[6px]" />
                <Skeleton className="w-8 h-8 rounded-[6px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
