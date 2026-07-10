import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar, BottomTabBar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'divyaanshkumargupta24@gmail.com'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isAdmin = user.email === ADMIN_EMAIL

  if (!isAdmin) {
    const admin = createServiceRoleClient()
    const { data: approval } = await admin
      .from('user_approvals')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!approval) {
      // New user with no record — create one and block them
      await admin.from('user_approvals').insert({
        user_id: user.id,
        email: user.email ?? '',
        status: 'pending',
      })
      redirect('/pending')
    }

    if (approval.status !== 'approved') {
      redirect('/pending')
    }
  }

  const { data: semester } = await supabase
    .from('semesters')
    .select('name')
    .eq('is_active', true)
    .eq('user_id', user.id)
    .maybeSingle()

  const { count } = await supabase
    .from('semesters')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const noSemesters = !count || count === 0

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F]">
      <Sidebar semesterName={noSemesters ? null : (semester?.name ?? 'No active semester')} isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar semesterName={noSemesters ? null : semester?.name} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-36 md:pb-8">
          {children}
        </main>
      </div>

      <BottomTabBar isAdmin={isAdmin} />
    </div>
  )
}
