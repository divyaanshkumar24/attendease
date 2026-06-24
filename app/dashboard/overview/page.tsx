import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getAllSubjectStats } from '@/lib/attendance'
import { getSparklineData } from '@/lib/analytics'
import type { Subject, Semester } from '@/lib/types'
import OverviewClient from './OverviewClient'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function OverviewPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: semester } = await supabase
    .from('semesters').select('*').eq('is_active', true).eq('user_id', user!.id).maybeSingle()

  if (!semester) {
    return (
      <div className="flex items-center justify-center h-48 border border-[#EBEBEB] border-dashed rounded-[10px]">
        <p className="text-[#ABABAB] text-[14px]">
          No active semester.{' '}
          <a href="/onboarding" className="text-[#5B5BD6] hover:underline">Set one up</a>.
        </p>
      </div>
    )
  }

  const sem = semester as Semester

  const start = new Date(sem.start_date)
  const end = new Date(sem.end_date)
  const today = new Date()
  const totalWeeks = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (7 * 864e5)))
  const currentWeek = Math.min(totalWeeks, Math.max(1, Math.ceil((today.getTime() - start.getTime()) / (7 * 864e5))))
  const semProgress = Math.round(Math.min(100, Math.max(0, (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100)))

  const { data: subjectsRaw } = await supabase
    .from('subjects').select('*').eq('semester_id', sem.id).eq('user_id', user!.id)
  const subjects = (subjectsRaw ?? []) as Subject[]

  // Single batched call for all subject stats (3 queries regardless of subject count)
  const allStats = await getAllSubjectStats(supabase, sem.id, user!.id)
  const statsById = new Map(allStats.map(s => [s.subjectId, s]))

  // Sparklines in parallel (not sequential)
  const sparklines = await Promise.all(subjects.map(s => getSparklineData(supabase, s.id, user!.id)))

  const subjectData = subjects.map((s, i) => ({
    subject: s,
    stats: statsById.get(s.id) ?? allStats[0],
    sparkline: sparklines[i],
  }))

  const totAttended = subjectData.reduce((a, d) => a + d.stats.attended, 0)
  const totMissed = subjectData.reduce((a, d) => a + d.stats.missed, 0)
  const totScheduled = subjectData.reduce((a, d) => a + d.stats.totalScheduled, 0)
  const overallPct = totScheduled > 0 ? Math.round((totAttended / totScheduled) * 100) : 0

  return (
    <OverviewClient
      semesterName={sem.name}
      currentWeek={currentWeek}
      totalWeeks={totalWeeks}
      semProgress={semProgress}
      subjectData={subjectData}
      totAttended={totAttended}
      totMissed={totMissed}
      totScheduled={totScheduled}
      overallPct={overallPct}
    />
  )
}
