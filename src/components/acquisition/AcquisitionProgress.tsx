import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity } from 'lucide-react'
import { usePipelineStatus } from '../../hooks/usePipelineStatus'
import { overlayVariants, modalVariants } from '../../motion/variants'

interface AcquisitionProgressProps {
  onClose: () => void
}

const STAGES = [
  { s: 'receiving',   label: 'Device received'           },
  { s: 'hashing',     label: 'Hashing original'          },
  { s: 'imaging',     label: 'Acquiring image'           },
  { s: 'verifying',   label: 'Verifying integrity'       },
  { s: 'parsing',     label: 'Parsing filesystem'        },
  { s: 'recovering',  label: 'Recovering deleted clips'  },
  { s: 'correlating', label: 'Correlating timeline'      },
  { s: 'complete',    label: 'Analysis complete'         },
]

export function AcquisitionProgress({ onClose }: AcquisitionProgressProps) {
  const { stage, stageLabel, progress, isRunning, startPipeline, reset } = usePipelineStatus()

  const stageIndex = (s: string) => STAGES.findIndex(x => x.s === s)
  const currentIdx = stageIndex(stage)

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="glass-modal-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="glass-modal"
          style={{ width: '100%', maxWidth: 480, padding: '28px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className={isRunning ? 'neo-subtle neo-pulse' : 'neo-subtle'}
                style={{
                  width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px',
                }}
              >
                <Activity size={17} color="var(--color-accent-blue)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-fg-primary)', fontSize: 'var(--text-body)' }}>
                  Acquisition Pipeline
                </div>
                <p className="eyebrow" style={{ marginTop: 2 }}>DVR forensic image acquisition</p>
              </div>
            </div>
            <button
              className="glass-btn"
              onClick={onClose}
              style={{ padding: '8px', minWidth: 'unset', width: 34, height: 34, borderRadius: '10px' }}
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Stage label */}
          <div style={{ marginBottom: '10px', minHeight: 22 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={stageLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: stage === 'complete' ? 'var(--color-accent-green)' : 'var(--color-fg-secondary)',
                  fontWeight: 500, margin: 0,
                }}
              >
                {stageLabel}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress track — neo pressed */}
          <div className="neo-progress" style={{ marginBottom: '6px' }}>
            <motion.div
              className="neo-progress-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                background: stage === 'complete' ? 'var(--color-accent-green)' : 'var(--color-accent-blue)',
              }}
            />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: 'var(--color-fg-disabled)',
            marginBottom: '20px',
          }}>
            <span>Imaging progress</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{progress}%</span>
          </div>

          {/* Stage checklist — neo pressed container */}
          <div
            className="neo-pressed"
            style={{
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {STAGES.map(({ s, label }, i) => {
              const isDone   = currentIdx > i
              const isActive = s === stage

              return (
                <div
                  key={s}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: 'var(--text-body-sm)',
                    color: isDone
                      ? 'var(--color-accent-green)'
                      : isActive
                        ? 'var(--color-fg-primary)'
                        : 'var(--color-fg-disabled)',
                    transition: 'color 0.2s',
                  }}
                >
                  <div
                    className={`neo-dot ${isDone ? 'neo-dot-success' : isActive ? 'neo-dot-active' : ''}`}
                    style={{ flexShrink: 0 }}
                  />
                  {label}
                  {isActive && isRunning && (
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      style={{ color: 'var(--color-accent-blue)', fontSize: '10px', marginLeft: 2 }}
                    >
                      ●
                    </motion.span>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA — matches mockup .neo-button */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            {!isRunning && stage !== 'complete' && (
              <button
                className="neo-btn-primary"
                onClick={startPipeline}
                style={{ width: '100%', gap: '8px' }}
              >
                <Activity size={16} />
                Start Acquisition
              </button>
            )}
            {!isRunning && stage === 'complete' && (
              <button className="neo-btn-secondary" onClick={reset} style={{ marginRight: 'auto' }}>
                Reset
              </button>
            )}
            {isRunning && (
              <div
                className="glass-badge"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
              >
                <span className="status-dot running" />
                Pipeline running…
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
