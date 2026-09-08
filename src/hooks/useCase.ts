import { useState, useCallback } from 'react'
import { CaseData, CustodyAction, CustodyEntry, PipelineStage } from '../types'
import { CASE_DATA } from '../data/caseData'

interface UseCaseReturn {
  caseData: CaseData | null
  isLoading: boolean
  error: string | null
  loadCase: (caseId?: string) => void
  updateCase: (updater: (current: CaseData) => CaseData) => void
  addCustodyEntry: (action: CustodyAction, detail: string, timestamp?: string) => void
  applyPipelineStage: (stage: PipelineStage) => void
}

const cloneCaseData = (): CaseData => {
  const cloned = JSON.parse(JSON.stringify(CASE_DATA)) as CaseData
  const sourceStart = Date.parse(cloned.custodyChain[0]?.timestamp ?? cloned.createdAt)
  const currentStart = Date.now()
  const timeShift = Number.isNaN(sourceStart) ? 0 : currentStart - sourceStart

  return {
    ...cloned,
    createdAt: new Date(Date.parse(cloned.createdAt) + timeShift).toISOString(),
    custodyChain: cloned.custodyChain.map((entry) => ({
      ...entry,
      timestamp: new Date(Date.parse(entry.timestamp) + timeShift).toISOString(),
    })),
  }
}

const verifyChain = (entries: CustodyEntry[]) => {
  if (!entries.length) return true

  return entries.every((entry, index) => {
    if (index === 0) return true
    const previous = entries[index - 1]
    return entry.prev_hash === previous.entry_hash
  })
}

const appendCustodyEntry = (current: CaseData, action: CustodyAction, detail: string, timestamp = new Date().toISOString()) => {
  const lastEntry = current.custodyChain[current.custodyChain.length - 1]
  const nextSeq = (lastEntry?.seq ?? 0) + 1
  const prevHash = lastEntry?.entry_hash ?? '0'.repeat(64)
  const entry: CustodyEntry = {
    seq: nextSeq,
    timestamp,
    action,
    detail,
    prev_hash: prevHash,
    entry_hash: `${prevHash.slice(-12)}-${nextSeq}-${action}-${detail}`.replace(/\s+/g, '-').slice(0, 128),
  }

  const nextEntries = [...current.custodyChain, entry]
  return {
    ...current,
    custodyChain: nextEntries,
    chainVerified: verifyChain(nextEntries),
  }
}

/**
 * Hook that provides access to case data.
 * Currently loads from the local static mock; in production this
 * would fetch from the Python pipeline API.
 */
export function useCase(): UseCaseReturn {
  const [caseData, setCaseData] = useState<CaseData | null>(() => cloneCaseData())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateCase = useCallback((updater: (current: CaseData) => CaseData) => {
    setCaseData((current) => {
      if (!current) return current
      return updater(current)
    })
  }, [])

  const addCustodyEntry = useCallback((action: CustodyAction, detail: string, timestamp?: string) => {
    updateCase((current) => appendCustodyEntry(current, action, detail, timestamp ?? new Date().toISOString()))
  }, [updateCase])

  const applyPipelineStage = useCallback((stage: PipelineStage) => {
    updateCase((current) => {
      if (!current) return current

      let next = { ...current }
      const stageToEntry: Partial<Record<PipelineStage, { action: CustodyAction; detail: string }>> = {
        receiving: { action: 'DEVICE_RECEIVED', detail: 'Device received and queued for imaging' },
        hashing: { action: 'ORIGINAL_HASHED', detail: 'Original disk hashed with MD5 and SHA-256' },
        imaging: { action: 'IMAGE_ACQUIRED', detail: `Forensic image written to ${current.caseId.toLowerCase()}_disk.dd` },
        verifying: { action: 'INTEGRITY_CHECK', detail: 'Hash verification passed between original and image' },
        parsing: { action: 'VENDOR_IDENTIFIED', detail: `${current.device.vendor} / ${current.device.model}` },
        recovering: { action: 'DELETED_RECOVERY', detail: 'Deleted video clips recovered from unallocated space' },
        correlating: { action: 'TIMELINE_BUILT', detail: 'Timeline reconstructed across camera streams' },
        complete: { action: 'CUSTODY_CHAIN_VERIFIED', detail: 'Chain integrity verified and case analysis complete' },
      }

      if (stageToEntry[stage]) {
        const entry = stageToEntry[stage]!
        next = appendCustodyEntry(next, entry.action, entry.detail)
      }

      if (stage === 'hashing') {
        next = {
          ...next,
          integrity: {
            ...next.integrity,
            original: {
              md5: 'aec2008e4d6ee7324d9e87992311dd80',
              sha256: 'cad7aa90a34da45717f30555f112392e1fa0187943cd0634e3dedfb79f046d7e',
            },
          },
        }
      }

      if (stage === 'imaging') {
        next = {
          ...next,
          integrity: {
            ...next.integrity,
            image: {
              md5: 'aec2008e4d6ee7324d9e87992311dd80',
              sha256: 'cad7aa90a34da45717f30555f112392e1fa0187943cd0634e3dedfb79f046d7e',
            },
            match: true,
          },
        }
      }

      if (stage === 'complete') {
        next = {
          ...next,
          chainVerified: true,
        }
      }

      return {
        ...next,
        chainVerified: verifyChain(next.custodyChain),
      }
    })
  }, [updateCase])

  const loadCase = useCallback((_caseId?: string) => {
    setIsLoading(true)
    setError(null)
    setTimeout(() => {
      setCaseData(cloneCaseData())
      setIsLoading(false)
    }, 600)
  }, [])

  return { caseData, isLoading, error, loadCase, updateCase, addCustodyEntry, applyPipelineStage }
}
