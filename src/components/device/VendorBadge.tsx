import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { DeviceInfo } from '../../types'

interface VendorBadgeProps {
  device: DeviceInfo
}

const VENDOR_COLORS: Record<string, string> = {
  'CP Plus': 'var(--color-accent-blue)',
  'Dahua Technology': 'var(--color-accent-amber)',
  'HIKVISION': 'var(--color-accent-red)',
  'Uniview': 'var(--color-accent-green)',
}

export function VendorBadge({ device }: VendorBadgeProps) {
  const color = VENDOR_COLORS[device.vendor] ?? 'var(--color-accent-blue)'

  return (
    <motion.div
      className="neo"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-2xl)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        minWidth: 200,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow behind icon */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 30%, ${color}15 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div
        className="neo-subtle"
        style={{
          width: 64, height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <Cpu size={28} color={color} />
      </div>

      <div>
        <div style={{
          fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-fg-primary)', lineHeight: 1.2,
        }}>
          {device.vendor}
        </div>
        <div style={{
          fontSize: 'var(--text-body-sm)', color, fontFamily: 'var(--font-mono)',
          marginTop: 'var(--space-1)',
        }}>
          {device.model}
        </div>
        {device.signature && (
          <div style={{
            fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)',
            fontFamily: 'var(--font-mono)', marginTop: 'var(--space-2)',
          }}>
            sig: {device.signature}
          </div>
        )}
      </div>
    </motion.div>
  )
}
