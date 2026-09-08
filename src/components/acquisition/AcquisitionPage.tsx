import { motion } from 'framer-motion'
import { HardDrive, CheckCircle, Lock, Database, Plus, FolderOpen, Upload, ShieldCheck, FileCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CaseData, CustodyAction } from '../../types'
import { HashVerifyBadge } from './HashVerifyBadge'
import { listContainerVariants, listItemVariants } from '../../motion/variants'
import { formatDate } from '../../utils/format'

interface AcquisitionPageProps {
  caseData: CaseData
  onCaseUpdate: (updater: (current: CaseData) => CaseData) => void
  onAddCustodyEntry: (action: CustodyAction, detail: string, timestamp?: string) => void
}

const MANUAL_ACTIONS: CustodyAction[] = [
  'CASE_OPENED',
  'DEVICE_RECEIVED',
  'ORIGINAL_HASHED',
  'IMAGE_ACQUIRED',
  'IMAGE_HASHED',
  'INTEGRITY_CHECK',
  'VENDOR_IDENTIFIED',
  'CLIPS_EXTRACTED',
  'DELETED_RECOVERY',
  'TIMELINE_BUILT',
  'CUSTODY_CHAIN_VERIFIED',
]

const SUPPORTED_VENDORS = [
  { name: 'CP Plus', signature: 'CPP_VOLHDR', models: ['CP-X2-NVR', 'CP-UVR-1601'] },
  { name: 'Dahua Technology', signature: 'DH_FS_MAGIC', models: ['DHI-NVR5216', 'XVR5108'] },
  { name: 'Hikvision', signature: 'HIK_PART_TAG', models: ['DS-7608NI', 'iDS-7216'] },
  { name: 'Uniview', signature: 'UNV_INDEX01', models: ['NVR301-08', 'NVR516'] },
  { name: 'Honeywell Security', signature: 'HONEYWELL_FS', models: ['HNVR-4016'] },
  { name: 'Matrix', signature: 'MATRIX_NVR', models: ['COSEC ARC'] },
  { name: 'Godrej', signature: 'GODREJ_NVR', models: ['DVR 16CH'] },
  { name: 'TP-Link', signature: 'TPLINK_VIGI', models: ['VIGI NVR1008'] },
]

export function AcquisitionPage({ caseData, onCaseUpdate, onAddCustodyEntry }: AcquisitionPageProps) {
  const { integrity } = caseData
  const deviceEntry = caseData.custodyChain.find(e => e.action === 'DEVICE_RECEIVED')
  const imageEntry = caseData.custodyChain.find(e => e.action === 'IMAGE_ACQUIRED')

  const [manualCaseId, setManualCaseId] = useState(caseData.caseId)
  const [manualDescription, setManualDescription] = useState(caseData.description)
  const [manualVendor, setManualVendor] = useState(caseData.device.vendor)
  const [manualModel, setManualModel] = useState(caseData.device.model)
  const [customAction, setCustomAction] = useState<CustodyAction>('DEVICE_RECEIVED')
  const [customDetail, setCustomDetail] = useState('Manual entry added by analyst')
  const [caseUpdateMessage, setCaseUpdateMessage] = useState('')
  const [selectedVendor, setSelectedVendor] = useState(caseData.device.vendor)
  const [selectedEvidence, setSelectedEvidence] = useState<File | null>(null)
  const [writeBlockerConfirmed, setWriteBlockerConfirmed] = useState(false)
  const [intakeMessage, setIntakeMessage] = useState('')

  const presetOptions = useMemo(() => [
    { label: 'Case 001 — Shop theft', value: 'CASE001', description: 'Simulated DVR theft investigation' },
    { label: 'Case 002 — Retail fraud', value: 'CASE002', description: 'Multi-camera retail dispute review' },
    { label: 'Case 003 — Asset seizure', value: 'CASE003', description: 'Evidence imaging and chain verification' },
  ], [])

  const handleApplyManualCase = () => {
    onCaseUpdate((current) => ({
      ...current,
      caseId: manualCaseId.trim() || current.caseId,
      description: manualDescription.trim() || current.description,
      device: {
        ...current.device,
        vendor: manualVendor.trim() || current.device.vendor,
        model: manualModel.trim() || current.device.model,
      },
    }))
    setCaseUpdateMessage(`Case details applied at ${new Date().toLocaleTimeString()}`)
  }

  const handleAddCustomEntry = () => {
    if (!customDetail.trim()) return
    onAddCustodyEntry(customAction, customDetail.trim())
    setCustomDetail('')
  }

  const handleRegisterEvidence = () => {
    if (!selectedEvidence || !writeBlockerConfirmed) {
      setIntakeMessage('Select an evidence image and confirm the write-blocker protocol first.')
      return
    }

    const vendor = SUPPORTED_VENDORS.find((item) => item.name === selectedVendor)
    onCaseUpdate((current) => ({
      ...current,
      device: {
        ...current.device,
        vendor: selectedVendor,
        model: manualModel.trim() || vendor?.models[0] || current.device.model,
        signature: vendor?.signature || current.device.signature,
      },
    }))
    onAddCustodyEntry('DEVICE_RECEIVED', `Evidence registered: ${selectedEvidence.name} (${selectedVendor})`)
    setIntakeMessage(`Evidence registered at ${new Date().toLocaleTimeString()}. Original remains read-only.`)
  }

  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Evidence Intake</h3>
          <div className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ShieldCheck size={12} />
            <span>Prototype write-blocker workflow</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
              Vendor adapter
              <select
                className="glass-input"
                value={selectedVendor}
                onChange={(event) => {
                  const vendor = SUPPORTED_VENDORS.find((item) => item.name === event.target.value)
                  setSelectedVendor(event.target.value)
                  if (vendor) setManualModel(vendor.models[0])
                }}
              >
                {SUPPORTED_VENDORS.map((vendor) => <option key={vendor.name} value={vendor.name}>{vendor.name}</option>)}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
              Forensic image / source media
              <input
                className="glass-input"
                type="file"
                accept=".dd,.e01,.img,.bin,.dav,.mp4,.264"
                onChange={(event) => setSelectedEvidence(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-fg-secondary)', fontSize: 'var(--text-body-sm)' }}>
            <input type="checkbox" checked={writeBlockerConfirmed} onChange={(event) => setWriteBlockerConfirmed(event.target.checked)} />
            Source media is connected through a hardware/software write-blocker and will be treated as immutable.
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button className="neo-btn-primary" onClick={handleRegisterEvidence} style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={15} />
              Register evidence
            </button>
            {selectedEvidence && (
              <span className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCheck size={12} /> {selectedEvidence.name}
              </span>
            )}
          </div>
          {intakeMessage && (
            <span style={{ color: intakeMessage.startsWith('Evidence registered') ? 'var(--color-accent-green)' : 'var(--color-accent-red)', fontSize: 'var(--text-caption)' }}>
              {intakeMessage}
            </span>
          )}
        </div>
      </div>

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

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Manual Case Selection</h3>
          <div className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FolderOpen size={12} />
            <span>Preset / manual review</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
              Case ID
              <input value={manualCaseId} onChange={(e) => setManualCaseId(e.target.value)} className="glass-input" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
              Device Vendor
              <input value={manualVendor} onChange={(e) => setManualVendor(e.target.value)} className="glass-input" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
              Device Model
              <input value={manualModel} onChange={(e) => setManualModel(e.target.value)} className="glass-input" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
              Preset selection
              <select
                className="glass-input"
                onChange={(e) => {
                  const preset = presetOptions.find((item) => item.value === e.target.value)
                  if (!preset) return
                  setManualCaseId(preset.value)
                  setManualDescription(preset.description)
                }}
                defaultValue=""
              >
                <option value="" disabled>Select a preset</option>
                {presetOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
            Case description
            <input value={manualDescription} onChange={(e) => setManualDescription(e.target.value)} className="glass-input" />
          </label>

          <button className="neo-btn-primary" onClick={handleApplyManualCase} style={{ width: 'fit-content' }}>
            Apply case details
          </button>
          {caseUpdateMessage && (
            <span style={{ color: 'var(--color-accent-green)', fontSize: 'var(--text-caption)' }}>
              {caseUpdateMessage}
            </span>
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Add Manual Custody Entry</h3>
          <div className="glass-badge" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Plus size={12} />
            <span>Live chain update</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)' }}>
            Action
            <select value={customAction} onChange={(e) => setCustomAction(e.target.value as CustodyAction)} className="glass-input">
              {MANUAL_ACTIONS.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-fg-muted)', gridColumn: '1 / -1' }}>
            Detail
            <input value={customDetail} onChange={(e) => setCustomDetail(e.target.value)} className="glass-input" />
          </label>

          <button className="neo-btn-primary" onClick={handleAddCustomEntry} style={{ width: 'fit-content' }}>
            Add chain entry
          </button>
        </div>
      </div>

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
