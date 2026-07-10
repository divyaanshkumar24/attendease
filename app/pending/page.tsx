import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PendingClient from './PendingClient'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'divyaanshkumargupta24@gmail.com'

export default async function PendingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin never lands here
  if (user.email === ADMIN_EMAIL) redirect('/dashboard/today')

  const admin = createServiceRoleClient()
  const { data: approval } = await admin
    .from('user_approvals')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  // Already approved → let them in
  if (approval?.status === 'approved') redirect('/dashboard/today')

  // No record at all → create one so admin can see them
  if (!approval) {
    await admin.from('user_approvals').insert({
      user_id: user.id,
      email: user.email ?? '',
      status: 'pending',
    })
  }

  return <PendingClient email={user.email ?? ''} rejected={approval?.status === 'rejected'} />
}
