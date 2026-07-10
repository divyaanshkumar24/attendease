import { createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { userId, email } = await request.json() as { userId: string; email: string }
  if (!userId || !email) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  const admin = createServiceRoleClient()
  const { error } = await admin
    .from('user_approvals')
    .upsert(
      { user_id: userId, email, status: 'pending' },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
