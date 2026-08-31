import { motion } from 'framer-motion'
import { Cpu, Database, Fingerprint, CheckCircle } from 'lucide-react'
import { CaseData } from '../../types'
import { VendorBadge } from './VendorBadge'
import { listContainerVariants, listItemVariants } from '../../motion/variants'

interface DevicePageProps {
  caseData: CaseData
}

export function DevicePage({ caseData }: DevicePageProps) {
  const { device } = caseData
  const vendorEntry = caseData.custodyChain.find(e => e.action === 'VENDOR_IDENTIFIED')

  const signatureDb: Record<string, { vendor: string; description: string }> = {
    CPP_VOLHDR:    { vendor: 'CP Plus',           description: 'Volume header marker found at sector 0' },
    DH_FS_MAGIC:   { vendor: 'Dahua Technology',  description: 'Dahua filesystem magic bytes' },
    HIK_PART_TAG:  { vendor: 'HIKVISION',         description: 'Hikvision partition table tag' },
    UNV_INDEX01:   { vendor: 'Uniview',            description: 'Uniview index block identifier' },
  }

  const sigInfo = device.signature ? signatureDb[device.signature] : null

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Hero — vendor badge + identity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass"
        style={{
          padding: 'var(--space-10)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-10)',
          flexWrap: 'wrap',
        }}
      >
        <VendorBadge device={device} />

        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Fingerprint size={16} color="var(--color-accent-blue)" />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontWeight: 'var(--font-weight-semibold)' }}>
              Device Identification
            </span>
          </div>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-fg-primary)', margin: 0, marginBottom: 'var(--space-2)' }}>
            {device.vendor}
          </h2>
          <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-fg-secondary)', margin: 0, marginBottom: 'var(--space-4)', fontFamily: 'var(--font-mono)' }}>
            {device.model}
          </h3>

          {vendorEntry && (
            <div className="glass-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CheckCircle size={12} color="var(--color-accent-green)" />
              <span>Identified by pipeline on {new Date(vendorEntry.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Identification details */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Identification Method</h3>
        </div>
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}
        >
          {[
            {
              icon: <Database size={18} />,
              label: 'Signature Detected',
              value: device.signature ?? '—',
              mono: true,
              accent: true,
            },
            {
              icon: <Fingerprint size={18} />,
              label: 'Vendor Match',
              value: sigInfo ? sigInfo.vendor : device.vendor,
              mono: false,
              accent: false,
            },
            {
              icon: <Cpu size={18} />,
              label: 'Signature Description',
              value: sigInfo ? sigInfo.description : 'Signature database match',
              mono: false,
              accent: false,
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={listItemVariants}
              className="neo-card"
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                color: item.accent ? 'var(--color-accent-blue)' : 'var(--color-fg-muted)',
              }}>
                {item.icon}
                <span style={{ fontSize: 'var(--text-caption)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {item.label}
                </span>
              </div>
              <div style={{
                fontSize: item.mono ? 'var(--text-body-sm)' : 'var(--text-body)',
                fontFamily: item.mono ? 'var(--font-mono)' : undefined,
                color: item.accent ? 'var(--color-accent-blue)' : 'var(--color-fg-primary)',
                wordBreak: 'break-all',
              }}>
                {item.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Supported vendors info */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Supported Vendor Signatures</h3>
          <div className="glass-badge">Signature Database v1.0</div>
        </div>
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table" style={{ background: 'transparent' }}>
            <thead>
              <tr>
                <th>Signature</th>
                <th>Vendor</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(signatureDb).map(([sig, info]) => (
                <tr key={sig} className="glass-table-row">
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-blue)', fontSize: 'var(--text-body-sm)' }}>
                    {sig}
                  </td>
                  <td style={{ color: 'var(--color-fg-primary)', fontWeight: sig === device.signature ? 'var(--font-weight-semibold)' : undefined }}>
                    {info.vendor}
                  </td>
                  <td style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-body-sm)' }}>
                    {info.description}
                  </td>
                  <td>
                    {sig === device.signature ? (
                      <span className="neo-badge neo-badge-verified" style={{ fontSize: 'var(--text-caption)' }}>
                        <CheckCircle size={11} color="var(--color-accent-green)" />
                        Matched
                      </span>
                    ) : (
                      <span className="glass-badge" style={{ fontSize: 'var(--text-caption)' }}>
                        In database
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
