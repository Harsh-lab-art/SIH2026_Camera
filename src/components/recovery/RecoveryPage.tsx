import { motion } from 'framer-motion'
import { Search, HardDrive, Camera } from 'lucide-react'
import { CaseData } from '../../types'
import { ConfidenceTag } from './ConfidenceTag'
import { listContainerVariants, listItemVariants } from '../../motion/variants'
import { formatDate } from '../../utils/format'

interface RecoveryPageProps {
  caseData: CaseData
}

export function RecoveryPage({ caseData }: RecoveryPageProps) {
  const { recovered } = caseData
  const highCount = recovered.filter(r => r.confidence === 'high').length
  const mediumCount = recovered.filter(r => r.confidence === 'medium').length

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Header panel — glass */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass"
        style={{
          padding: 'var(--space-6) var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)',
          flexWrap: 'wrap',
          borderColor: 'rgba(245,158,11,0.3)',
        }}
      >
        <div
          className="neo"
          style={{
            width: 52, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-xl)', flexShrink: 0,
            boxShadow: 'var(--shadow-neo-warning-raised)',
          }}
        >
          <Search size={22} color="var(--color-accent-amber)" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-fg-primary)', marginBottom: 'var(--space-1)' }}>
            {recovered.length} Deleted Clips Recovered
          </div>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', margin: 0 }}>
            Recovered from unallocated disk space via H.264 NAL unit signature carving.
            These files were deleted from the DVR filesystem but remnant data remained on-disk.
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-3)', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-green)' }}>{highCount}</div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)' }}>High conf.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-amber)' }}>{mediumCount}</div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)' }}>Medium conf.</div>
          </div>
        </div>
      </motion.div>

      {/* Recovery method explanation */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Recovery Method</h3>
        </div>
        <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {[
            {
              icon: <HardDrive size={20} color="var(--color-accent-blue)" />,
              title: 'Unallocated Space Scanning',
              desc: 'The recovery engine scans unallocated disk sectors for H.264 NAL unit start codes (0x00 0x00 0x00 0x01), identifying video frame boundaries in raw binary data.',
            },
            {
              icon: <Search size={20} color="var(--color-accent-amber)" />,
              title: 'Signature Carving',
              desc: 'Once a start code is found, the engine reads forward, reconstructing the NALU structure to estimate the original file extent and extract a recoverable clip.',
            },
          ].map((item) => (
            <div key={item.title} style={{ flex: '1 1 240px', display: 'flex', gap: 'var(--space-4)' }}>
              <div
                className="neo-subtle"
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', flexShrink: 0, marginTop: 2 }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-fg-primary)', marginBottom: 'var(--space-1)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovered clips list */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Recovered Clips</h3>
          <div className="glass-badge">{recovered.length} clips</div>
        </div>

        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          {recovered.map((clip, i) => (
            <motion.div
              key={clip.id}
              variants={listItemVariants}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)',
                flexWrap: 'wrap',
                borderColor: clip.confidence === 'high' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
              }}
            >
              {/* Index */}
              <div
                className="neo-subtle"
                style={{
                  width: 44, height: 44, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', borderRadius: 'var(--radius-lg)', flexShrink: 0,
                  fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-fg-muted)', fontSize: 'var(--text-body-sm)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-fg-primary)', fontFamily: 'var(--font-mono)' }}>
                    {clip.id}
                  </span>
                  <ConfidenceTag confidence={clip.confidence} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>
                  <Camera size={12} />
                  <span>{clip.camera}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div style={{ textAlign: 'right', minWidth: 160 }}>
                <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', marginBottom: 2 }}>
                  Recovered timestamp
                </div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {formatDate(clip.startTime)}
                </div>
              </div>

              {/* Method */}
              <div style={{ flex: 2, minWidth: 220 }}>
                <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
                  Method
                </div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>
                  {clip.method}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
