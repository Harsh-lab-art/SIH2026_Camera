import { motion } from 'framer-motion'
import { Clock, Camera, AlertTriangle, Film, Search } from 'lucide-react'
import { CaseData, TimelineEvent } from '../../types'
import { listContainerVariants, listItemVariants } from '../../motion/variants'
import { formatDate } from '../../utils/format'

interface TimelinePageProps {
  caseData: CaseData
}

const CAMERA_COLORS: Record<string, string> = {
  'Camera 1': 'var(--color-accent-blue)',
  'Camera 2': 'var(--color-accent-green)',
}

function TimelineEventRow({ event, index, total }: { event: TimelineEvent; index: number; total: number }) {
  const color = CAMERA_COLORS[event.camera] ?? 'var(--color-accent-blue)'
  const isLast = index === total - 1

  return (
    <motion.div
      variants={listItemVariants}
      custom={index}
      style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative' }}
    >
      {/* Timeline spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
        {/* Node */}
        <div
          className={event.type === 'recovered' ? 'neo-dot neo-dot-warning' : 'neo-dot neo-dot-active'}
          style={{
            width: 14, height: 14, marginTop: 4, flexShrink: 0,
            background: event.type === 'recovered'
              ? (event.confidence === 'high' ? 'var(--color-accent-green)' : 'var(--color-accent-amber)')
              : color,
            boxShadow: `0 0 8px ${event.type === 'recovered' ? (event.confidence === 'high' ? 'var(--color-accent-green)' : 'var(--color-accent-amber)') : color}`,
          }}
        />
        {/* Connector line */}
        {!isLast && (
          <div style={{
            flex: 1, width: 2, background: 'linear-gradient(180deg, var(--color-border-secondary), transparent)',
            marginTop: 4,
          }} />
        )}
      </div>

      {/* Content */}
      <div
        className="glass-card glass-hover"
        style={{ flex: 1, marginBottom: isLast ? 0 : 'var(--space-2)', padding: 'var(--space-4) var(--space-5)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {/* Event type badge */}
            {event.type === 'recovered' ? (
              <span
                className={`neo-badge ${event.confidence === 'high' ? 'neo-badge-verified' : 'neo-badge-unverified'}`}
                style={{ fontSize: 'var(--text-caption)', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Search size={11} />
                Recovered
              </span>
            ) : (
              <span className="glass-badge" style={{ fontSize: 'var(--text-caption)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Film size={11} />
                Extracted
              </span>
            )}

            {/* Camera badge */}
            <span
              className="glass-badge"
              style={{ color, fontSize: 'var(--text-caption)', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Camera size={11} style={{ color }} />
              {event.camera}
            </span>

            {/* Clip ID */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-primary)', fontWeight: 'var(--font-weight-medium)' }}>
              {event.clipId}
            </span>
          </div>

          {/* Timestamp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
            <Clock size={12} />
            {formatDate(event.time)}
          </div>
        </div>

        {/* Confidence note for recovered */}
        {event.type === 'recovered' && event.confidence && (
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)' }}>
            <AlertTriangle size={11} color={event.confidence === 'high' ? 'var(--color-accent-green)' : 'var(--color-accent-amber)'} />
            <span>{event.confidence.charAt(0).toUpperCase() + event.confidence.slice(1)} confidence recovery — timestamp may have clock-drift variance</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function TimelinePage({ caseData }: TimelinePageProps) {
  const sorted = [...caseData.timeline].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Info banner — glass */}
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
          gap: 'var(--space-6)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Clock size={18} color="var(--color-accent-blue)" />
          <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-fg-primary)' }}>
            {sorted.length} correlated events
          </span>
        </div>

        <div className="glass-divider" style={{ width: 1, height: 24, background: 'var(--glass-border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>
          <AlertTriangle size={14} color="var(--color-accent-amber)" />
          <span>Clock drift normalized by <strong style={{ color: 'var(--color-fg-secondary)' }}>{Math.abs(caseData.clockOffsetSec)}s</strong> — timestamps are UTC-corrected</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-4)' }}>
          {Object.entries(CAMERA_COLORS).map(([cam, color]) => (
            <div key={cam} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-caption)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ color: 'var(--color-fg-muted)' }}>{cam}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Camera strips — visual overview */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Camera Coverage Overview</h3>
        </div>
        <div className="glass-card" style={{ overflow: 'hidden', padding: 'var(--space-6)' }}>
          {['Camera 1', 'Camera 2'].map((cam) => {
            const camEvents = sorted.filter(e => e.camera === cam)
            const color = CAMERA_COLORS[cam]
            return (
              <div key={cam} style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-body-sm)', color }}>
                  <Camera size={13} />
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{cam}</span>
                  <span style={{ color: 'var(--color-fg-disabled)' }}>— {camEvents.length} events</span>
                </div>
                {/* Scrubber bar */}
                <div
                  className="neo-pressed"
                  style={{ height: 32, borderRadius: 'var(--radius-full)', position: 'relative', overflow: 'hidden' }}
                >
                  {camEvents.map((ev, i) => {
                    const totalSpan = new Date(sorted[sorted.length - 1].time).getTime() - new Date(sorted[0].time).getTime()
                    const offset = new Date(ev.time).getTime() - new Date(sorted[0].time).getTime()
                    const pct = totalSpan > 0 ? (offset / totalSpan) * 100 : i * 20
                    return (
                      <motion.div
                        key={ev.clipId}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        title={`${ev.clipId} — ${formatDate(ev.time)}`}
                        style={{
                          position: 'absolute',
                          left: `${Math.min(pct, 95)}%`,
                          top: 4,
                          bottom: 4,
                          width: ev.type === 'recovered' ? 6 : 10,
                          background: ev.type === 'recovered'
                            ? (ev.confidence === 'high' ? 'var(--color-accent-green)' : 'var(--color-accent-amber)')
                            : color,
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          boxShadow: `0 0 6px ${color}80`,
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline event list */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Event Log</h3>
          <div className="glass-badge">{sorted.length} events — clock-drift corrected</div>
        </div>

        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {sorted.map((event, i) => (
            <TimelineEventRow key={`${event.clipId}-${i}`} event={event} index={i} total={sorted.length} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
