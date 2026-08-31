import { motion } from 'framer-motion'
import { Film, Filter } from 'lucide-react'
import { CaseData } from '../../types'
import { ClipCard } from './ClipCard'
import { listContainerVariants } from '../../motion/variants'

interface ClipsPageProps {
  caseData: CaseData
}

export function ClipsPage({ caseData }: ClipsPageProps) {
  const cameras = [...new Set(caseData.clips.map(c => c.camera))]
  const totalDuration = caseData.clips.reduce((sum, c) => sum + c.durationSec, 0)

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Stats bar — glass */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass"
        style={{
          padding: 'var(--space-5) var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Total Clips', value: caseData.clips.length },
          { label: 'Cameras', value: cameras.length },
          { label: 'Total Duration', value: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s` },
          { label: 'Codec', value: 'H.264' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-fg-primary)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
              {stat.label}
            </div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Film size={16} color="var(--color-accent-blue)" />
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>Extracted from forensic image</span>
        </div>
      </motion.div>

      {/* Grid header */}
      <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="section-title">
          Extracted Recordings
          <span style={{ marginLeft: 'var(--space-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', fontWeight: 'var(--font-weight-normal)' }}>
            {caseData.clips.length} clips
          </span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Filter size={14} color="var(--color-fg-muted)" />
          {cameras.map(cam => (
            <span key={cam} className="glass-badge">{cam}</span>
          ))}
        </div>
      </div>

      {/* Clip grid */}
      <motion.div
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {caseData.clips.map((clip, i) => (
          <ClipCard key={clip.id} clip={clip} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
