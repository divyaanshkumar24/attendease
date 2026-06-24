import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'

export default function SettingsLoading() {
  return (
    <div className="max-w-xl space-y-6">
      {/* Semester management */}
      <SkeletonCard className="space-y-4">
        <Skeleton className="h-4 w-40" />
        {[1,2].map(i => (
          <div key={i} className="flex items-center gap-3 border border-[#EBEBEB] rounded-[8px] px-3 py-2.5">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-[4px]" />
          </div>
        ))}
        <div className="border-t border-[#EBEBEB] pt-4 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-full rounded-[8px]" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-9 rounded-[8px]" />
            <Skeleton className="h-9 rounded-[8px]" />
          </div>
          <Skeleton className="h-8 w-28 rounded-[8px]" />
        </div>
      </SkeletonCard>

      {/* Account */}
      <SkeletonCard className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full rounded-[8px]" />
        <div className="border-t border-[#EBEBEB] pt-4 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-full rounded-[8px]" />
          <Skeleton className="h-9 w-full rounded-[8px]" />
          <Skeleton className="h-8 w-32 rounded-[8px]" />
        </div>
        <div className="border-t border-[#EBEBEB] pt-4">
          <Skeleton className="h-8 w-20 rounded-[8px]" />
        </div>
      </SkeletonCard>

      {/* Danger zone */}
      <SkeletonCard className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-8 w-28 rounded-[8px]" />
      </SkeletonCard>
    </div>
  )
}
