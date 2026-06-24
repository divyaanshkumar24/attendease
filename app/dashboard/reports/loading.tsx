import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function ReportsLoading() {
  return (
    <div className="max-w-3xl space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] p-1">
        <Skeleton className="flex-1 h-8 rounded-[6px]" />
        <Skeleton className="flex-1 h-8 rounded-[6px]" />
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-8 h-8 rounded-[6px]" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="w-8 h-8 rounded-[6px]" />
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <SkeletonCard key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-10" />
          </SkeletonCard>
        ))}
      </div>

      {/* Table */}
      <SkeletonCard className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#EBEBEB] grid grid-cols-4 gap-3">
          {['Subject','Scheduled','Attended','%'].map(h => (
            <Skeleton key={h} className="h-3 w-full" />
          ))}
        </div>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="px-4 py-3 border-b border-[#EBEBEB] last:border-b-0 grid grid-cols-4 gap-3 items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="w-2.5 h-2.5 rounded-[3px] shrink-0" />
              <Skeleton className="h-3.5 flex-1" />
            </div>
            <Skeleton className="h-3.5 w-6" />
            <Skeleton className="h-3.5 w-6" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        ))}
      </SkeletonCard>

      {/* Export button row */}
      <div className="flex justify-end">
        <Skeleton className="h-8 w-28 rounded-[8px]" />
      </div>
    </div>
  )
}
