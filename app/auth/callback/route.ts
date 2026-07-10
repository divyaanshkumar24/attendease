import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/today'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      // Create approval record if it doesn't exist yet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('user_approvals') as any).upsert(
        { user_id: data.user.id, email: data.user.email ?? '', status: 'pending' },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )

      const { data: approval } = await supabase
        .from('user_approvals')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (approval?.status === 'approved') return NextResponse.redirect(`${origin}${next}`)
      return NextResponse.redirect(`${origin}/pending`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
