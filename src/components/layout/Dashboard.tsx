import { motion } from 'framer-motion'
import {
  HardDrive, Film, Search, Clock, Link2,
  CheckCircle, Shield, Calendar,
} from 'lucide-react'
import { CaseData, Page } from '../../types'
import { listContainerVariants, listItemVariants, cardVariants } from '../../motion/variants'
import { formatDate, shortHash } from '../../utils/format'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  accent?: string
}

function StatCard({ icon, label, value, sub, accent = 'var(--color-accent-blue)' }: StatCardProps) {
  return (
    <motion.div variants={cardVariants} className="neo-card">
      <div style={{
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '10px',
        background: 'rgba(59,110,224,0.08)',
        marginBottom: '14px',
      }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>

      <div style={{
        fontSize: '1.6rem', fontWeight: 700,
        color: 'var(--color-fg-primary)', lineHeight: 1.1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-fg-muted)', fontWeight: 500 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-disabled)', marginTop: 3 }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

interface DashboardProps {
  caseData: CaseData
  onNavigate: (page: Page) => void
}

export function Dashboard({ caseData, onNavigate }: DashboardProps) {
  const lastEntry = caseData.custodyChain[caseData.custodyChain.length - 1]

  return (
    <div style={{ padding: '32px 28px', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      {/* Case header — glass panel like mockup */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="glass"
        style={{
          padding: '24px 28px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient tint from mockup .glass-panel::before */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(59,110,224,0.10), transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div>
          <p className="eyebrow" style={{ marginBottom: 6 }}>{caseData.caseId} — Active</p>
          <h2 style={{
            fontSize: 'var(--text-h2)', fontWeight: 700,
            color: 'var(--color-fg-primary)', margin: 0,
            letterSpacing: '-0.01em', lineHeight: 1.2,
          }}>
            {caseData.description}
          </h2>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <div className={`neo-badge ${caseData.chainVerified ? 'neo-badge-verified' : 'neo-badge-failed'}`}>
              <CheckCircle size={11} color="var(--color-accent-green)" />
              Chain Verified
            </div>
            <div className="glass-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={11} />
              {formatDate(caseData.createdAt)}
            </div>
          </div>
        </div>

        <div
          className="neo-subtle"
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          <p className="eyebrow" style={{ marginBottom: 4 }}>Last custody hash</p>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)',
            color: 'var(--color-accent-green)',
          }}>
            {shortHash(lastEntry?.entry_hash ?? '')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-fg-disabled)', marginTop: 3 }}>
            {caseData.custodyChain.length} entries
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard icon={<HardDrive size={17} />} label="Device"        value={caseData.device.vendor}                       sub={caseData.device.model} />
        <StatCard icon={<Shield size={17} />}    label="Integrity"     value={caseData.integrity.match ? '✓ Match' : '✗ Fail'} sub="MD5 + SHA-256"        accent="var(--color-accent-green)" />
        <StatCard icon={<Film size={17} />}      label="Clips"         value={caseData.clips.length}                        sub="H.264 recordings" />
        <StatCard icon={<Search size={17} />}    label="Recovered"     value={caseData.recovered.length}                    sub="Deleted files"         accent="var(--color-accent-amber)" />
        <StatCard icon={<Clock size={17} />}     label="Timeline"      value={caseData.timeline.length}                     sub="Correlated events" />
        <StatCard icon={<Link2 size={17} />}     label="Chain Entries" value={caseData.custodyChain.length}                 sub="Audit log"             accent="var(--color-accent-green)" />
      </motion.div>

      {/* Quick access */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Quick Access</h3>
        </div>

        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '14px',
          }}
        >
          {[
            { page: 'acquisition' as Page, title: 'Acquisition & Integrity', desc: 'MD5 / SHA-256 verification, image details',     icon: <HardDrive size={18} />, status: 'success' },
            { page: 'clips'       as Page, title: 'Extracted Clips',         desc: `${caseData.clips.length} recordings — Camera 1 & 2`,       icon: <Film      size={18} />, status: 'running' },
            { page: 'recovery'    as Page, title: 'Recovery',                desc: `${caseData.recovered.length} deleted clips via carving`,     icon: <Search    size={18} />, status: 'warning' },
            { page: 'timeline'    as Page, title: 'Timeline',                desc: `${caseData.timeline.length} events, clock-drift normalized`, icon: <Clock     size={18} />, status: 'success' },
            { page: 'custody'     as Page, title: 'Chain of Custody',        desc: 'Hash-chained tamper-evident audit log',          icon: <Link2     size={18} />, status: 'success' },
            { page: 'report'      as Page, title: 'Case Report',             desc: 'Full forensic report, export to markdown',      icon: <Shield    size={18} />, status: 'success' },
          ].map((item) => (
            <motion.button
              key={item.page}
              variants={listItemVariants}
              className="glass-card glass-hover"
              onClick={() => onNavigate(item.page)}
              style={{ textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%', border: '1px solid var(--glass-border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--color-accent-blue)' }}>{item.icon}</span>
                <span className={`status-dot ${item.status}`} style={{ marginTop: 3 }} />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-fg-primary)', marginBottom: 4, fontSize: 'var(--text-body-sm)' }}>
                {item.title}
              </div>
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-fg-muted)' }}>
                {item.desc}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
