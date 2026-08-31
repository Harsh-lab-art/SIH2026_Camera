import { motion } from 'framer-motion'
import { Link2, ShieldCheck } from 'lucide-react'
import { CaseData, CustodyAction } from '../../types'
import { ChainIntegrityBadge } from './ChainIntegrityBadge'
import { chainLinkVariants } from '../../motion/variants'
import { shortHash, formatDate } from '../../utils/format'

const ACTION_CONFIG: Record<CustodyAction, { label: string; color: string }> = {
  CASE_OPENED:             { label: 'Case Opened',          color: 'var(--color-accent-blue)'  },
  DEVICE_RECEIVED:         { label: 'Device Received',       color: 'var(--color-accent-blue)'  },
  ORIGINAL_HASHED:         { label: 'Original Hashed',       color: 'var(--color-accent-amber)' },
  IMAGE_ACQUIRED:          { label: 'Image Acquired',        color: 'var(--color-accent-amber)' },
  IMAGE_HASHED:            { label: 'Image Hashed',          color: 'var(--color-accent-amber)' },
  INTEGRITY_CHECK:         { label: 'Integrity Check',       color: 'var(--color-accent-green)' },
  VENDOR_IDENTIFIED:       { label: 'Vendor Identified',     color: 'var(--color-accent-blue)'  },
  CLIPS_EXTRACTED:         { label: 'Clips Extracted',       color: 'var(--color-accent-green)' },
  DELETED_RECOVERY:        { label: 'Deleted Recovery',      color: 'var(--color-accent-amber)' },
  TIMELINE_BUILT:          { label: 'Timeline Built',        color: 'var(--color-accent-blue)'  },
  CUSTODY_CHAIN_VERIFIED:  { label: 'Chain Verified',        color: 'var(--color-accent-green)' },
}

interface CustodyPageProps {
  caseData: CaseData
}

export function CustodyPage({ caseData }: CustodyPageProps) {
  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Header — glass panel */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass"
        style={{
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-10)',
          flexWrap: 'wrap',
          borderColor: 'rgba(16,185,129,0.2)',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(17,24,39,0.7) 100%)',
        }}
      >
        <ChainIntegrityBadge verified={caseData.chainVerified} entryCount={caseData.custodyChain.length} />

        <div style={{ flex: 1, minWidth: 280 }}>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-fg-primary)', margin: 0, marginBottom: 'var(--space-3)' }}>
            Hash-Chained Audit Log
          </h2>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-fg-muted)', margin: 0, lineHeight: 'var(--leading-relaxed)' }}>
            Every action in this case is recorded as a cryptographic entry. Each entry's SHA-256 hash incorporates the hash of the previous entry —
            meaning any alteration of historical records causes every subsequent hash to break, making tampering immediately detectable.
          </p>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ShieldCheck size={12} color="var(--color-accent-green)" />
              <span>No blockchain required</span>
            </div>
            <div className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Link2 size={12} />
              <span>SHA-256 chained</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chain visualization */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Chain Entries</h3>
          <div className="glass-badge">{caseData.custodyChain.length} entries</div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {caseData.custodyChain.map((entry, i) => {
            const cfg = ACTION_CONFIG[entry.action] ?? { label: entry.action, color: 'var(--color-fg-muted)' }
            const isFirst = i === 0
            const isLast = i === caseData.custodyChain.length - 1

            return (
              <motion.div
                key={entry.seq}
                variants={chainLinkVariants}
                custom={i}
                style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative' }}
              >
                {/* Chain connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                  {/* Genesis / link */}
                  <div
                    style={{
                      width: isFirst ? 20 : 14,
                      height: isFirst ? 20 : 14,
                      borderRadius: '50%',
                      background: cfg.color,
                      boxShadow: `0 0 ${isFirst || isLast ? '10px' : '6px'} ${cfg.color}60`,
                      marginTop: 12,
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  />
                  {!isLast && (
                    <div style={{
                      flex: 1, width: 2,
                      background: `linear-gradient(180deg, ${cfg.color}40, ${(ACTION_CONFIG[caseData.custodyChain[i + 1]?.action] ?? cfg).color}40)`,
                      marginTop: 4,
                    }} />
                  )}
                </div>

                {/* Entry card */}
                <div
                  className="glass-card"
                  style={{
                    flex: 1,
                    marginBottom: isLast ? 0 : 'var(--space-1)',
                    padding: 'var(--space-4) var(--space-5)',
                    borderColor: `${cfg.color}25`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {/* Left: seq + action + detail */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)',
                        color: 'var(--color-fg-disabled)', minWidth: 24,
                      }}>
                        #{String(entry.seq).padStart(2, '0')}
                      </span>
                      <span
                        className="glass-badge"
                        style={{ color: cfg.color, fontSize: 'var(--text-caption)', fontFamily: 'var(--font-mono)' }}
                      >
                        {entry.action}
                      </span>
                      <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-primary)' }}>
                        {entry.detail}
                      </span>
                    </div>

                    {/* Right: timestamp */}
                    <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>

                  {/* Hash chain info */}
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)' }}>
                      <span>prev:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: isFirst ? 'var(--color-fg-disabled)' : 'var(--color-fg-muted)' }}>
                        {isFirst ? '0000…0000' : shortHash(entry.prev_hash)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)' }}>
                      <span>hash:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: cfg.color }}>
                        {shortHash(entry.entry_hash)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
