import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'

import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { PageShell } from './components/layout/PageShell'
import { Dashboard } from './components/layout/Dashboard'

import { AcquisitionPage } from './components/acquisition/AcquisitionPage'
import { AcquisitionProgress } from './components/acquisition/AcquisitionProgress'
import { DevicePage } from './components/device/DevicePage'
import { ClipsPage } from './components/parsing/ClipsPage'
import { RecoveryPage } from './components/recovery/RecoveryPage'
import { TimelinePage } from './components/timeline/TimelinePage'
import { CustodyPage } from './components/custody/CustodyPage'
import { ReportPage } from './components/report/ReportPage'

import { useCase } from './hooks/useCase'
import { CaseData, Page, PipelineStage } from './types'

export default function App() {
  const { caseData, updateCase, addCustodyEntry, applyPipelineStage } = useCase()
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAcquisitionModal, setShowAcquisitionModal] = useState(false)

  const handlePipelineStage = useCallback((stage: PipelineStage) => {
    applyPipelineStage(stage)
    if (stage === 'complete') {
      setActivePage('report')
    }
  }, [applyPipelineStage])

  const handleManualCaseUpdate = useCallback((updater: (current: CaseData) => CaseData) => {
    updateCase(updater)
  }, [updateCase])

  if (!caseData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-fg-muted)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Loading case data…
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard caseData={caseData} onNavigate={setActivePage} />
      case 'acquisition':
        return (
          <AcquisitionPage
            caseData={caseData}
            onCaseUpdate={handleManualCaseUpdate}
            onAddCustodyEntry={addCustodyEntry}
          />
        )
      case 'device': return <DevicePage caseData={caseData} />
      case 'clips': return <ClipsPage caseData={caseData} />
      case 'recovery': return <RecoveryPage caseData={caseData} />
      case 'timeline': return <TimelinePage caseData={caseData} />
      case 'custody': return <CustodyPage caseData={caseData} />
      case 'report': return <ReportPage caseData={caseData} />
      default: return <Dashboard caseData={caseData} onNavigate={setActivePage} />
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-fg-primary)',
        position: 'relative',
        minWidth: 0,
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(p => !p)}
        caseId={caseData.caseId}
      />

      {/* Main column: topbar + content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar
          activePage={activePage}
          chainVerified={caseData.chainVerified}
          caseId={caseData.caseId}
        />

        {/* Content area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            position: 'relative',
            background: 'var(--color-bg-primary)',
          }}
        >
          <PageShell page={activePage}>
            {renderPage()}
          </PageShell>
        </main>
      </div>

      <button
        className="neo-btn-primary neo-pulse"
        onClick={() => setShowAcquisitionModal(true)}
        style={{
          position: 'fixed',
          bottom: 'var(--space-8)',
          right: 'var(--space-8)',
          zIndex: 'var(--z-popover)' as unknown as number,
          padding: '12px 22px',
          minWidth: 'unset',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'var(--text-body-sm)',
          borderRadius: '14px',
        }}
        aria-label="Start new acquisition"
      >
        <Play size={15} />
        New Acquisition
      </button>

      {/* Acquisition modal */}
      <AnimatePresence>
        {showAcquisitionModal && (
          <AcquisitionProgress
            onClose={() => setShowAcquisitionModal(false)}
            onStageUpdate={handlePipelineStage}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
