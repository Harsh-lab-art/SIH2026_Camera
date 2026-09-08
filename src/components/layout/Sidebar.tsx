import { motion } from 'framer-motion'
import {
  Shield, HardDrive, Cpu, Film, Search,
  Clock, Link2, FileText, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Page } from '../../types'
import { listContainerVariants, listItemVariants } from '../../motion/variants'

interface NavItem {
  id: Page
  label: string
  icon: React.ReactNode
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',   label: 'Dashboard',       icon: <Shield    size={16} /> },
  { id: 'acquisition', label: 'Acquisition',     icon: <HardDrive size={16} />, badge: '✓' },
  { id: 'device',      label: 'Device ID',       icon: <Cpu       size={16} /> },
  { id: 'clips',       label: 'Extracted Clips', icon: <Film      size={16} />, badge: '4' },
  { id: 'recovery',    label: 'Recovery',        icon: <Search    size={16} />, badge: '2' },
  { id: 'timeline',    label: 'Timeline',        icon: <Clock     size={16} /> },
  { id: 'custody',     label: 'Chain of Custody',icon: <Link2     size={16} /> },
  { id: 'report',      label: 'Report',          icon: <FileText  size={16} /> },
]

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
  collapsed: boolean
  onToggleCollapse: () => void
  caseId: string
}

export function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse, caseId }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 260 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
           background: 'rgba(4, 14, 28, 0.88)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
           borderRight: '1px solid rgba(83,178,255,0.18)',
           boxShadow: '8px 0 28px rgba(0,0,0,0.32), inset -1px 0 rgba(22,230,209,0.05)',
        overflow: 'hidden',
        zIndex: 200,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 18px' : '0 20px',
             borderBottom: '1px solid rgba(83,178,255,0.14)',
          flexShrink: 0,
          gap: '10px',
        }}
      >
        <div
          className="neo-subtle"
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '10px', flexShrink: 0,
          }}
        >
          <Shield size={15} color="var(--color-accent-blue)" />
        </div>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.16 }}
          >
            <div style={{
              fontSize: '13px', fontWeight: 600,
              color: 'var(--color-fg-primary)',
              letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              ForensicVision
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-fg-disabled)', marginTop: 1 }}>
              DVR/NVR Analysis
            </div>
          </motion.div>
        )}
      </div>

      {/* Case pill */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: '14px 20px 6px' }}
        >
          <span className="eyebrow">{caseId} — Active</span>
        </motion.div>
      )}

      {/* Nav */}
      <nav style={{
        flex: 1,
        padding: collapsed ? '12px 10px' : '10px 12px',
        overflowY: 'auto',
      }}>
        <motion.ul
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          style={{
            listStyle: 'none', padding: 0, margin: 0,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id
            return (
              <motion.li key={item.id} variants={listItemVariants}>
                <button
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: collapsed ? '9px 12px' : '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-fg-primary)' : 'var(--color-fg-muted)',
                    background: isActive
                       ? 'linear-gradient(90deg, rgba(41,156,255,0.24), rgba(22,230,209,0.08))'
                      : 'transparent',
                    boxShadow: isActive
                       ? 'inset 3px 0 var(--color-accent-cyan), 0 0 18px rgba(41,156,255,0.12)'
                      : 'none',
                    transition: 'all var(--duration-fast) var(--ease-out)',
                    position: 'relative',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(41,156,255,0.10)'
                      e.currentTarget.style.color = 'var(--color-fg-secondary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--color-fg-muted)'
                    }
                  }}
                >
                  <span style={{
                    color: isActive ? 'var(--color-accent-blue)' : 'inherit',
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                      {item.badge && (
                        <span
                          className="glass-badge"
                          style={{
                            fontSize: '10px',
                            padding: '1px 7px',
                            color: item.badge === '✓'
                              ? 'var(--color-accent-green)'
                              : 'var(--color-accent-blue)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      style={{
                        position: 'absolute',
                        left: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3, height: 18,
                        background: 'var(--color-accent-blue)',
                        borderRadius: '0 2px 2px 0',
                      }}
                    />
                  )}
                </button>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* Collapse toggle */}
      <div style={{
        padding: '12px 12px',
        borderTop: '1px solid rgba(83,178,255,0.14)',
      }}>
        <button
          onClick={onToggleCollapse}
          className="neo-btn-secondary"
          style={{
            width: '100%',
            padding: '8px',
            minWidth: 'unset',
            justifyContent: 'center',
            gap: '6px',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={15} /><span>Collapse</span></>
          }
        </button>
      </div>
    </motion.aside>
  )
}
