import { motion } from 'framer-motion'
import { HardDrive, CheckCircle, Lock, Database } from 'lucide-react'
import { CaseData } from '../../types'
import { HashVerifyBadge } from './HashVerifyBadge'
import { listContainerVariants, listItemVariants } from '../../motion/variants'
import { formatDate } from '../../utils/format'

interface AcquisitionPageProps {
  caseData: CaseData
}

export function AcquisitionPage({ caseData }: AcquisitionPageProps) {
  const { integrity } = caseData
  const deviceEntry = caseData.custodyChain.find(e => e.action === 'DEVICE_RECEIVED')
  const imageEntry = caseData.custodyChain.find(e => e.action === 'IMAGE_ACQUIRED')

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Integrity status banner — glass panel */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass"
        style={{
          padding: 'var(--space-6) var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          borderColor: integrity.match ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
          background: integrity.match
            ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(17,24,39,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(17,24,39,0.7) 100%)',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="neo"
          style={{
            width: 56, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-xl)', flexShrink: 0,
            boxShadow: integrity.match ? 'var(--shadow-neo-success-raised)' : 'var(--shadow-neo-error-raised)',
          }}
        >
          {integrity.match
            ? <Lock size={24} color="var(--color-accent-green)" />
            : <HardDrive size={24} color="var(--color-accent-red)" />
          }
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <CheckCircle size={16} color={integrity.match ? 'var(--color-accent-green)' : 'var(--color-accent-red)'} />
            <span style={{
              fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)',
              color: integrity.match ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
            }}>
              Forensic Integrity {integrity.match ? 'Verified' : 'FAILED'}
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', margin: 0 }}>
            Both MD5 and SHA-256 hashes match between the original device and forensic image.
            The evidence has not been altered.
          </p>
        </div>
      </motion.div>

      {/* Hash comparison */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Hash Verification</h3>
          <div className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Database size={12} />
            <span>Cryptographic comparison</span>
          </div>
        </div>

        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <motion.div variants={listItemVariants}>
            <HashVerifyBadge
              label="MD5"
              original={integrity.original.md5}
              image={integrity.image.md5}
              match={integrity.original.md5 === integrity.image.md5}
            />
          </motion.div>
          <motion.div variants={listItemVariants}>
            <HashVerifyBadge
              label="SHA-256"
              original={integrity.original.sha256}
              image={integrity.image.sha256}
              match={integrity.original.sha256 === integrity.image.sha256}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Acquisition timeline from custody chain */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Acquisition Events</h3>
        </div>
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table" style={{ background: 'transparent' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Action</th>
                <th>Detail</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {caseData.custodyChain
                .filter(e => ['CASE_OPENED','DEVICE_RECEIVED','ORIGINAL_HASHED','IMAGE_ACQUIRED','IMAGE_HASHED','INTEGRITY_CHECK'].includes(e.action))
                .map((entry) => (
                  <tr key={entry.seq} className="glass-table-row">
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-fg-disabled)' }}>
                      {String(entry.seq).padStart(2, '0')}
                    </td>
                    <td>
                      <span className="glass-badge" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)' }}>
                        {entry.action}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-fg-primary)', fontFamily: entry.action.includes('HASHED') || entry.action === 'INTEGRITY_CHECK' ? 'var(--font-mono)' : undefined, fontSize: entry.action.includes('HASHED') ? 'var(--text-caption)' : undefined }}>
                      {entry.detail}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)' }}>
                      {formatDate(entry.timestamp)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image details */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Image Details</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            { label: 'Device Received', value: deviceEntry ? formatDate(deviceEntry.timestamp) : '—', icon: <HardDrive size={16} /> },
            { label: 'Image Written', value: imageEntry ? imageEntry.detail : '—', icon: <Database size={16} /> },
            { label: 'Acquisition Status', value: 'Complete', icon: <CheckCircle size={16} />, accent: true },
          ].map((item) => (
            <div key={item.label} className="neo-card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', color: item.accent ? 'var(--color-accent-green)' : 'var(--color-fg-muted)' }}>
                {item.icon}
                <span style={{ fontSize: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {item.label}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-primary)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
