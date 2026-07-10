import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PendingClient from './PendingClient'

export default async function PendingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: approval } = await supabase
    .from('user_approvals')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  // Already approved or no record (existing user) → send to dashboard
  if (!approval || approval.status === 'approved') redirect('/dashboard/today')

  return <PendingClient email={user.email ?? ''} rejected={approval.status === 'rejected'} />
}
