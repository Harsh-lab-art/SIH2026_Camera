import { RecoveryConfidence } from '../../types'
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface ConfidenceTagProps {
  confidence: RecoveryConfidence
}

const CONFIG: Record<RecoveryConfidence, { label: string; color: string; icon: React.ReactNode; badgeClass: string }> = {
  high: {
    label: 'High Confidence',
    color: 'var(--color-accent-green)',
    icon: <CheckCircle size={13} />,
    badgeClass: 'neo-badge-verified',
  },
  medium: {
    label: 'Medium Confidence',
    color: 'var(--color-accent-amber)',
    icon: <AlertTriangle size={13} />,
    badgeClass: 'neo-badge-unverified',
  },
  low: {
    label: 'Low Confidence',
    color: 'var(--color-accent-red)',
    icon: <AlertCircle size={13} />,
    badgeClass: 'neo-badge-failed',
  },
}

export function ConfidenceTag({ confidence }: ConfidenceTagProps) {
  const cfg = CONFIG[confidence]
  return (
    <span
      className={`neo-badge ${cfg.badgeClass}`}
      style={{ color: cfg.color, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)' }}
    >
      <span style={{ color: cfg.color }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}
