import { motion } from 'framer-motion'
import { Film, Clock, Camera } from 'lucide-react'
import { Clip } from '../../types'
import { formatDuration, formatDate } from '../../utils/format'
import { listItemVariants } from '../../motion/variants'

interface ClipCardProps {
  clip: Clip
  index: number
}

const CAMERA_COLORS: Record<string, string> = {
  'Camera 1': 'var(--color-accent-blue)',
  'Camera 2': 'var(--color-accent-green)',
  'Camera 3': 'var(--color-accent-amber)',
  'Camera 4': 'var(--color-accent-red)',
}

export function ClipCard({ clip, index }: ClipCardProps) {
  const cameraColor = CAMERA_COLORS[clip.camera] ?? 'var(--color-accent-blue)'

  return (
    <motion.div
      variants={listItemVariants}
      custom={index}
      className="glass-card glass-hover"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Camera color accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: cameraColor, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
      }} />

      {/* Video placeholder */}
      <div
        className="neo-pressed"
        style={{
          width: '100%', aspectRatio: '16/9',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)',
          gap: 'var(--space-2)', background: 'var(--color-bg-primary)',
        }}
      >
        <Film size={28} color={cameraColor} style={{ opacity: 0.7 }} />
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', fontFamily: 'var(--font-mono)' }}>
          {clip.path?.split('/').pop() ?? clip.id}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-fg-primary)', marginBottom: 'var(--space-1)' }}>
            {clip.id}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Camera size={12} color={cameraColor} />
            <span style={{ fontSize: 'var(--text-body-sm)', color: cameraColor }}>{clip.camera}</span>
          </div>
        </div>
        <span className="glass-badge" style={{ fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
          {clip.codec}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>
          <Clock size={12} />
          <span>{formatDate(clip.startTime)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>
          <Film size={12} />
          <span>{formatDuration(clip.durationSec)} duration</span>
        </div>
      </div>
    </motion.div>
  )
}
