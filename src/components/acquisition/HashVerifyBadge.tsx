import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

interface HashVerifyBadgeProps {
  label: string
  original: string
  image: string
  match: boolean
}

export function HashVerifyBadge({ label, original, image, match }: HashVerifyBadgeProps) {
  return (
    <motion.div
      className={`neo-badge ${match ? 'neo-badge-verified' : 'neo-badge-failed'}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        gap: 'var(--space-2)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
        {match
          ? <CheckCircle size={15} color="var(--color-accent-green)" />
          : <XCircle size={15} color="var(--color-accent-red)" />
        }
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 'var(--font-weight-semibold)',
          color: match ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
          fontSize: 'var(--text-body-sm)',
        }}>
          {label} — {match ? 'Match' : 'MISMATCH'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <span style={{ color: 'var(--color-fg-disabled)', minWidth: 60 }}>Original:</span>
          <span style={{ color: 'var(--color-fg-secondary)', wordBreak: 'break-all' }}>{original}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <span style={{ color: 'var(--color-fg-disabled)', minWidth: 60 }}>Image:</span>
          <span style={{
            color: match ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
            wordBreak: 'break-all',
          }}>
            {image}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
