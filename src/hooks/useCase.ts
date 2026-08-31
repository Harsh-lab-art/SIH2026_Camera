import { useState, useCallback } from 'react'
import { CaseData } from '../types'
import { CASE_DATA } from '../data/caseData'

interface UseCaseReturn {
  caseData: CaseData | null
  isLoading: boolean
  error: string | null
  loadCase: (caseId?: string) => void
}

/**
 * Hook that provides access to case data.
 * Currently loads from the local static mock; in production this
 * would fetch from the Python pipeline API.
 */
export function useCase(): UseCaseReturn {
  const [caseData, setCaseData] = useState<CaseData | null>(CASE_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCase = useCallback((_caseId?: string) => {
    setIsLoading(true)
    setError(null)
    // Simulate async fetch
    setTimeout(() => {
      setCaseData(CASE_DATA)
      setIsLoading(false)
    }, 600)
  }, [])

  return { caseData, isLoading, error, loadCase }
}
