import { motion } from 'framer-motion'
import { FileText, Download, CheckCircle, Shield, Film, Search, Clock, Link2 } from 'lucide-react'
import { CaseData } from '../../types'
import { formatDate, formatDuration, shortHash } from '../../utils/format'
import { listContainerVariants, listItemVariants } from '../../motion/variants'

interface ReportPageProps {
  caseData: CaseData
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      <div style={{
        fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-fg-muted)', textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)', marginBottom: 'var(--space-4)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function ReportPage({ caseData }: ReportPageProps) {
  const handleExport = () => {
    const lines = [
      `# Forensic Analysis Report — Case ${caseData.caseId}`,
      ``,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `## Device Identification`,
      `- Vendor: ${caseData.device.vendor}`,
      `- Model: ${caseData.device.model}`,
      `- Signature: ${caseData.device.signature ?? 'N/A'}`,
      ``,
      `## Acquisition Integrity`,
      `- Original MD5: ${caseData.integrity.original.md5}`,
      `- Image MD5:    ${caseData.integrity.image.md5}`,
      `- Original SHA256: ${caseData.integrity.original.sha256}`,
      `- Image SHA256:    ${caseData.integrity.image.sha256}`,
      `- Verified match: ${caseData.integrity.match}`,
      ``,
      `## Extracted Recordings`,
      ...caseData.clips.map(c => `- ${c.id} | ${c.camera} | ${c.startTime} | ${c.durationSec}s | ${c.codec}`),
      ``,
      `## Recovered (Deleted) Recordings`,
      ...caseData.recovered.map(r => `- ${r.id} | ${r.camera} | ${r.startTime} | ${r.method} | confidence: ${r.confidence}`),
      ``,
      `## Correlated Timeline (clock-drift normalized)`,
      ...caseData.timeline.map(e => `- ${e.time} — ${e.camera} — ${e.type === 'recovered' ? `Recovered: ${e.clipId} (${e.confidence})` : `Recording: ${e.clipId}`}`),
      ``,
      `## Chain of Custody`,
      `- Hash chain integrity verified: ${caseData.chainVerified}`,
      `- Total entries: ${caseData.custodyChain.length}`,
      `- Last entry hash: ${caseData.custodyChain[caseData.custodyChain.length - 1]?.entry_hash ?? 'N/A'}`,
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forensic_report_${caseData.caseId.toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Report header — glass */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-strong"
        style={{
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(17,24,39,0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div
            className="neo"
            style={{
              width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-2xl)', flexShrink: 0,
              boxShadow: 'var(--shadow-neo-primary-raised)',
            }}
          >
            <FileText size={26} color="var(--color-accent-blue)" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-fg-primary)', margin: 0, marginBottom: 'var(--space-1)' }}>
              Case {caseData.caseId} — Forensic Report
            </h2>
            <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', margin: 0 }}>
              {caseData.description} · Generated {formatDate(new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* Export button — neomorphic CTA */}
        <button
          className="neo-btn-primary neo-pulse"
          onClick={handleExport}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-4) var(--space-8)', minWidth: 180,
          }}
        >
          <Download size={18} />
          Export Report
        </button>
      </motion.div>

      {/* Report body */}
      <motion.div
        className="glass-card"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ padding: 'var(--space-10)' }}
      >
        {/* Device */}
        <motion.div variants={listItemVariants}>
          <SectionBlock title="Device Identification">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {[
                { label: 'Vendor', value: caseData.device.vendor, icon: <Shield size={14} /> },
                { label: 'Model', value: caseData.device.model, icon: <Shield size={14} />, mono: true },
                { label: 'Signature', value: caseData.device.signature ?? '—', icon: <Shield size={14} />, mono: true },
              ].map(item => (
                <div key={item.label} className="neo-subtle" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: item.mono ? 'var(--font-mono)' : undefined, color: 'var(--color-fg-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>
        </motion.div>

        {/* Integrity */}
        <motion.div variants={listItemVariants}>
          <div className="glass-divider" style={{ marginBottom: 'var(--space-8)' }} />
          <SectionBlock title="Acquisition Integrity">
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              <div className={`neo-badge ${caseData.integrity.match ? 'neo-badge-verified' : 'neo-badge-failed'}`}>
                <CheckCircle size={13} color={caseData.integrity.match ? 'var(--color-accent-green)' : 'var(--color-accent-red)'} />
                {caseData.integrity.match ? 'Integrity Verified' : 'Integrity FAILED'}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { label: 'Original MD5', value: caseData.integrity.original.md5 },
                { label: 'Image MD5', value: caseData.integrity.image.md5 },
                { label: 'Original SHA256', value: shortHash(caseData.integrity.original.sha256, 24) },
                { label: 'Image SHA256', value: shortHash(caseData.integrity.image.sha256, 24) },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--color-fg-disabled)', minWidth: 140 }}>{row.label}:</span>
                  <span style={{ color: 'var(--color-fg-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </SectionBlock>
        </motion.div>

        {/* Clips */}
        <motion.div variants={listItemVariants}>
          <div className="glass-divider" style={{ marginBottom: 'var(--space-8)' }} />
          <SectionBlock title="Extracted Recordings">
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table" style={{ background: 'transparent' }}>
                <thead>
                  <tr><th>ID</th><th>Camera</th><th>Start Time</th><th>Duration</th><th>Codec</th></tr>
                </thead>
                <tbody>
                  {caseData.clips.map(c => (
                    <tr key={c.id} className="glass-table-row">
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-blue)' }}>{c.id}</td>
                      <td><span className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Film size={11} />{c.camera}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)' }}>{c.startTime}</td>
                      <td>{formatDuration(c.durationSec)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{c.codec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>
        </motion.div>

        {/* Recovered */}
        <motion.div variants={listItemVariants}>
          <div className="glass-divider" style={{ marginBottom: 'var(--space-8)' }} />
          <SectionBlock title="Recovered (Deleted) Recordings">
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table" style={{ background: 'transparent' }}>
                <thead>
                  <tr><th>ID</th><th>Camera</th><th>Timestamp</th><th>Method</th><th>Confidence</th></tr>
                </thead>
                <tbody>
                  {caseData.recovered.map(r => (
                    <tr key={r.id} className="glass-table-row">
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-amber)' }}>{r.id}</td>
                      <td><span className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Search size={11} />{r.camera}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)' }}>{r.startTime}</td>
                      <td style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)' }}>{r.method}</td>
                      <td>
                        <span className={`neo-badge ${r.confidence === 'high' ? 'neo-badge-verified' : 'neo-badge-unverified'}`} style={{ fontSize: 'var(--text-caption)' }}>
                          {r.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={listItemVariants}>
          <div className="glass-divider" style={{ marginBottom: 'var(--space-8)' }} />
          <SectionBlock title="Correlated Timeline">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {caseData.timeline.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: i < caseData.timeline.length - 1 ? '1px solid var(--color-border-primary)' : 'none' }}>
                  <Clock size={12} color="var(--color-fg-disabled)" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)', minWidth: 200 }}>{ev.time}</span>
                  <span className="glass-badge" style={{ fontSize: 'var(--text-caption)' }}>{ev.camera}</span>
                  <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-primary)' }}>
                    {ev.type === 'recovered' ? `Recovered: ${ev.clipId} (${ev.confidence})` : `Recording: ${ev.clipId}`}
                  </span>
                </div>
              ))}
            </div>
          </SectionBlock>
        </motion.div>

        {/* Chain */}
        <motion.div variants={listItemVariants}>
          <div className="glass-divider" style={{ marginBottom: 'var(--space-8)' }} />
          <SectionBlock title="Chain of Custody Summary">
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className={`neo-badge ${caseData.chainVerified ? 'neo-badge-verified' : 'neo-badge-failed'}`}>
                <Link2 size={13} />
                Chain integrity: {caseData.chainVerified ? 'Verified' : 'FAILED'}
              </div>
              <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)' }}>
                {caseData.custodyChain.length} entries · Last hash: {shortHash(caseData.custodyChain[caseData.custodyChain.length - 1]?.entry_hash ?? '')}
              </span>
            </div>
          </SectionBlock>
        </motion.div>
      </motion.div>
    </div>
  )
}
