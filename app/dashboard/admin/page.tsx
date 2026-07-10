import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminClient from '@/app/admin/AdminClient'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'divyaanshkumargupta24@gmail.com'

export default async function DashboardAdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard/today')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: approvals } = await (supabase.from('user_approvals') as any)
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-[20px] font-[600] text-[#111111] dark:text-[#F0F0F0]">User approvals</h1>
        <p className="text-[13px] text-[#6B6B6B] dark:text-[#A0A0A0] mt-1">Manage who can access AttendEase.</p>
      </div>
      <AdminClient approvals={approvals ?? []} />
    </div>
  )
}
