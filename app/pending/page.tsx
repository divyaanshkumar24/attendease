import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PendingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // If already approved, send them to dashboard
  const { data: approval } = await supabase
    .from('user_approvals')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (approval?.status === 'approved') redirect('/dashboard/today')
  if (approval?.status === 'rejected') {
    return (
      <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <div className="bg-white dark:bg-[#1A1A1A] border border-[#EBEBEB] dark:border-[#2A2A2A] rounded-[10px] p-8">
            <div className="w-12 h-12 bg-[rgba(220,38,38,0.08)] dark:bg-[rgba(248,113,113,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[22px]">✗</span>
            </div>
            <h2 className="text-[17px] font-[500] text-[#111111] dark:text-[#F0F0F0] mb-2">Access denied</h2>
            <p className="text-[13px] text-[#6B6B6B] dark:text-[#A0A0A0]">
              Your account request was not approved. Contact the administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] text-center">
        <div className="bg-white dark:bg-[#1A1A1A] border border-[#EBEBEB] dark:border-[#2A2A2A] rounded-[10px] p-8">
          <div className="w-12 h-12 bg-[rgba(91,91,214,0.08)] dark:bg-[rgba(123,127,232,0.12)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[22px]">⏳</span>
          </div>
          <h2 className="text-[17px] font-[500] text-[#111111] dark:text-[#F0F0F0] mb-2">Pending approval</h2>
          <p className="text-[13px] text-[#6B6B6B] dark:text-[#A0A0A0]">
            Your account is awaiting approval from the administrator. You&apos;ll get access once it&apos;s approved — check back soon.
          </p>
          <p className="mt-4 text-[12px] text-[#ABABAB] dark:text-[#606060]">Signed in as <strong className="text-[#6B6B6B] dark:text-[#A0A0A0]">{user.email}</strong></p>
        </div>
        <form action="/auth/signout" method="post" className="mt-4">
          <button type="submit" className="text-[13px] text-[#6B6B6B] dark:text-[#A0A0A0] hover:text-[#111111] dark:hover:text-[#F0F0F0] hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
