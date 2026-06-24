import { Skeleton } from '@/components/ui/Skeleton'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function TimetableLoading() {
  return (
    <div className="max-w-4xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28 rounded-[8px]" />
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {DAYS.map(day => (
          <div key={day} className="space-y-2">
            <div className="bg-white border border-[#EBEBEB] rounded-[8px] py-2 flex justify-center">
              <Skeleton className="h-3.5 w-8" />
            </div>
            {[1, 2, ...(Math.random() > 0.5 ? [3] : [])].map(i => (
              <div key={i} className="bg-white border border-[#EBEBEB] rounded-[8px] p-2.5 space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
