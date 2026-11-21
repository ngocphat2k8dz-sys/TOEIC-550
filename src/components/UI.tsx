import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

export function ProgressBar({ value, label, color = 'blue' }: { value: number; label: string; color?: 'blue' | 'green' | 'orange' | 'purple' }) {
  const percent = Math.min(100, Math.max(0, Math.round(value)))
  return <div className={`progress-track ${color}`} role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
    <div style={{ width: `${percent}%` }} />
  </div>
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-intro">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>
    {action}
  </div>
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty-state"><Inbox size={24} aria-hidden="true" /><strong>{title}</strong>{children}</div>
}
