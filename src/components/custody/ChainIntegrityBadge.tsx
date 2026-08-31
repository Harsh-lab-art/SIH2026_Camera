import { motion } from 'framer-motion'
import { Link2, ShieldCheck, ShieldX } from 'lucide-react'

interface ChainIntegrityBadgeProps {
  verified: boolean
  entryCount: number
}

export function ChainIntegrityBadge({ verified, entryCount }: ChainIntegrityBadgeProps) {
  return (
    <motion.div
      className="neo"
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-2xl)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        textAlign: 'center',
        boxShadow: verified ? 'var(--shadow-neo-success-raised)' : 'var(--shadow-neo-error-raised)',
        position: 'relative',
        overflow: 'hidden',
        minWidth: 180,
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 30%, ${verified ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div
        className="neo-subtle"
        style={{
          width: 56, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-xl)',
          boxShadow: verified ? 'var(--shadow-neo-success-raised)' : 'var(--shadow-neo-error-raised)',
        }}
      >
        {verified
          ? <ShieldCheck size={26} color="var(--color-accent-green)" />
          : <ShieldX size={26} color="var(--color-accent-red)" />
        }
      </div>

      <div>
        <div style={{
          fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)',
          color: verified ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
          lineHeight: 1.2,
        }}>
          {verified ? 'Intact' : 'Broken'}
        </div>
        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', marginTop: 'var(--space-1)' }}>
          Chain Integrity
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)' }}>
        <Link2 size={12} />
        <span>{entryCount} linked entries</span>
      </div>
    </motion.div>
  )
}
