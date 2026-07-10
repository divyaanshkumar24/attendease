import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'divyaanshkumargupta24@gmail.com'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/today'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Admin always goes straight through
      if (data.user.email === ADMIN_EMAIL) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Use service role so RLS never blocks this insert
      const admin = createServiceRoleClient()
      await admin.from('user_approvals').upsert(
        { user_id: data.user.id, email: data.user.email ?? '', status: 'pending' },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )

      // Read back the actual status (existing users may already be approved)
      const { data: approval } = await admin
        .from('user_approvals')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (approval?.status === 'approved') {
        return NextResponse.redirect(`${origin}${next}`)
      }
      return NextResponse.redirect(`${origin}/pending`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
