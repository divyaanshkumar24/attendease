'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Check, X, Clock } from 'lucide-react'

interface Approval {
  user_id: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminClient({ approvals }: { approvals: Approval[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function act(userId: string, action: 'approved' | 'rejected') {
    setLoading(userId + action)
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    })
    setLoading(null)
    router.refresh()
  }

  const pending  = approvals.filter(a => a.status === 'pending')
  const approved = approvals.filter(a => a.status === 'approved')
  const rejected = approvals.filter(a => a.status === 'rejected')

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-[20px] font-[600] text-[#111111] dark:text-[#F0F0F0]">User approvals</h1>
          <p className="text-[13px] text-[#6B6B6B] dark:text-[#A0A0A0] mt-1">Manage who can access AttendEase.</p>
        </div>

        <Section title="Pending" count={pending.length} icon={<Clock size={14} className="text-[#D97706]" />}>
          {pending.length === 0 ? (
            <p className="text-[13px] text-[#ABABAB] dark:text-[#606060] px-4 py-3">No pending requests.</p>
          ) : pending.map(a => (
            <Row key={a.user_id} approval={a} loading={loading}>
              <Button size="sm" onClick={() => act(a.user_id, 'rejected')} disabled={!!loading} variant="danger" className="gap-1">
                <X size={13} /> Reject
              </Button>
              <Button size="sm" onClick={() => act(a.user_id, 'approved')} disabled={!!loading} className="gap-1">
                <Check size={13} /> Approve
              </Button>
            </Row>
          ))}
        </Section>

        <Section title="Approved" count={approved.length} icon={<Check size={14} className="text-[#1A9E5F]" />}>
          {approved.map(a => (
            <Row key={a.user_id} approval={a} loading={loading}>
              <Button size="sm" onClick={() => act(a.user_id, 'rejected')} disabled={!!loading} variant="danger" className="gap-1">
                <X size={13} /> Revoke
              </Button>
            </Row>
          ))}
        </Section>

        <Section title="Rejected" count={rejected.length} icon={<X size={14} className="text-[#DC2626]" />}>
          {rejected.map(a => (
            <Row key={a.user_id} approval={a} loading={loading}>
              <Button size="sm" onClick={() => act(a.user_id, 'approved')} disabled={!!loading} className="gap-1">
                <Check size={13} /> Approve
              </Button>
            </Row>
          ))}
        </Section>
      </div>
    </main>
  )
}

function Section({ title, count, icon, children }: { title: string; count: number; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-[13px] font-[500] text-[#111111] dark:text-[#F0F0F0]">{title}</h2>
        <span className="text-[12px] text-[#ABABAB] dark:text-[#606060]">({count})</span>
      </div>
      <div className="bg-white dark:bg-[#1A1A1A] border border-[#EBEBEB] dark:border-[#2A2A2A] rounded-[10px] divide-y divide-[#EBEBEB] dark:divide-[#2A2A2A] overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function Row({ approval, loading, children }: { approval: Approval; loading: string | null; children: React.ReactNode }) {
  const busy = loading?.startsWith(approval.user_id)
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${busy ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-[500] text-[#111111] dark:text-[#F0F0F0] truncate">{approval.email}</p>
        <p className="text-[11px] text-[#ABABAB] dark:text-[#606060]">{new Date(approval.created_at).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
      </div>
    </div>
  )
}
