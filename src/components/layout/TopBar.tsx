import { CheckCircle, AlertTriangle, Shield } from 'lucide-react'
import { Page } from '../../types'

const PAGE_TITLES: Record<Page, { eyebrow: string; title: string }> = {
  dashboard:   { eyebrow: 'Case 001 — Active',    title: 'Case Dashboard'          },
  acquisition: { eyebrow: 'Forensic Imaging',     title: 'Acquisition & Integrity' },
  device:      { eyebrow: 'Hardware Analysis',    title: 'Device Identification'   },
  clips:       { eyebrow: 'Extracted Media',      title: 'Recordings'              },
  recovery:    { eyebrow: 'Unallocated Space',    title: 'Deleted File Recovery'   },
  timeline:    { eyebrow: 'Multi-camera',         title: 'Correlated Timeline'     },
  custody:     { eyebrow: 'Audit Log',            title: 'Chain of Custody'        },
  report:      { eyebrow: 'Export-ready',         title: 'Case Report'             },
}

interface TopBarProps {
  activePage: Page
  chainVerified: boolean
  caseId: string
}

export function TopBar({ activePage, chainVerified, caseId }: TopBarProps) {
  const meta = PAGE_TITLES[activePage]

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.45)',
        boxShadow: '0 2px 12px rgba(31,41,61,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
        flexShrink: 0,
      }}
    >
      {/* Page identity */}
      <div>
        <p className="eyebrow" style={{ marginBottom: 2 }}>{meta.eyebrow}</p>
        <h1 style={{
          fontSize: 'var(--text-h3)',
          fontWeight: 600,
          color: 'var(--color-fg-primary)',
          margin: 0,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          {meta.title}
        </h1>
      </div>

      {/* Right: status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Chain badge */}
        <div
          className={`neo-badge ${chainVerified ? 'neo-badge-verified' : 'neo-badge-failed'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {chainVerified
            ? <CheckCircle size={12} color="var(--color-accent-green)" />
            : <AlertTriangle size={12} color="var(--color-accent-red)" />
          }
          Chain {chainVerified ? 'Verified' : 'Broken'}
        </div>

        {/* Case pill */}
        <div
          className="glass-badge"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span className="status-dot success" />
          {caseId}
        </div>

        {/* Avatar */}
        <div
          className="neo-avatar"
          style={{ flexShrink: 0 }}
          title="Forensic Analyst"
        >
          <Shield size={14} color="var(--color-fg-muted)" />
        </div>
      </div>
    </header>
  )
}
