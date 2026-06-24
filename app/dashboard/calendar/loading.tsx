import { Skeleton } from '@/components/ui/Skeleton'

export default function CalendarLoading() {
  return (
    <div className="max-w-3xl space-y-5">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-8 h-8 rounded-[6px]" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="w-8 h-8 rounded-[6px]" />
      </div>

      {/* Calendar grid */}
      <div className="bg-white border border-[#EBEBEB] rounded-[10px] overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-[#EBEBEB]">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className="py-2.5 flex justify-center">
              <Skeleton className="h-3 w-4" />
            </div>
          ))}
        </div>

        {/* Day cells — 5 rows */}
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className={`min-h-[76px] border-b border-r border-[#EBEBEB] p-2 ${
                i % 7 === 6 ? 'border-r-0' : ''
              } ${i >= 28 ? 'border-b-0' : ''}`}
            >
              <Skeleton className="h-6 w-6 rounded-full" />
              {i % 3 === 0 && (
                <div className="flex gap-1 mt-1.5">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
