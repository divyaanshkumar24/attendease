import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

const ADMIN_EMAIL = 'divyaansh@openpaws.ai'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard/today')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: approvals } = await (supabase.from('user_approvals') as any)
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminClient approvals={approvals ?? []} />
}
