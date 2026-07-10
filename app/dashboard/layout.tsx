import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar, BottomTabBar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check user approval status
  // Admin email from env var (set ADMIN_EMAIL in Vercel env vars)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'divyaanshkumargupta24@gmail.com'

  if (user.email !== ADMIN_EMAIL) {
    const { data: approval } = await supabase
      .from('user_approvals')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()

    // Only block if explicitly pending or rejected.
    // No record = existing user who pre-dates the approval system → auto-approve them.
    if (approval?.status === 'pending' || approval?.status === 'rejected') {
      redirect('/pending')
    }
  }

  const { data: semester } = await supabase
    .from('semesters')
    .select('name')
    .eq('is_active', true)
    .eq('user_id', user.id)
    .maybeSingle()

  // Check for semesters at all — if none, redirect to onboarding
  const { count } = await supabase
    .from('semesters')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const noSemesters = !count || count === 0

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F]">
      <Sidebar semesterName={noSemesters ? null : (semester?.name ?? 'No active semester')} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar semesterName={noSemesters ? null : semester?.name} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-36 md:pb-8">
          {children}
        </main>
      </div>

      <BottomTabBar />
    </div>
  )
}
