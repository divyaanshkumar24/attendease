import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function TodosLoading() {
  return (
    <div className="max-w-xl space-y-5">
      {/* Add task form */}
      <SkeletonCard className="space-y-3">
        <Skeleton className="h-3.5 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-[6px]" />
          <Skeleton className="h-9 flex-1 rounded-[6px]" />
          <Skeleton className="h-9 w-9 rounded-[6px] shrink-0" />
        </div>
      </SkeletonCard>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] p-1">
        {[1,2,3].map(i => (
          <Skeleton key={i} className="flex-1 h-8 rounded-[6px]" />
        ))}
      </div>

      {/* Task groups */}
      {[1,2].map(group => (
        <div key={group} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-[2px]" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <SkeletonCard className="p-0 divide-y divide-[#EBEBEB]">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="w-4 h-4 rounded-[3px] shrink-0" />
                <Skeleton className="h-3.5 flex-1" />
              </div>
            ))}
          </SkeletonCard>
        </div>
      ))}
    </div>
  )
}
