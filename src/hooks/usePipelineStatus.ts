import { useState, useCallback, useRef } from 'react'
import { PipelineStage } from '../types'

interface PipelineStep {
  stage: PipelineStage
  label: string
  durationMs: number
}

const PIPELINE_STEPS: PipelineStep[] = [
  { stage: 'receiving',  label: 'Receiving device…',        durationMs: 800  },
  { stage: 'hashing',    label: 'Hashing original disk…',   durationMs: 1200 },
  { stage: 'imaging',    label: 'Acquiring forensic image…', durationMs: 1600 },
  { stage: 'verifying',  label: 'Verifying integrity…',      durationMs: 900  },
  { stage: 'parsing',    label: 'Parsing filesystem…',       durationMs: 1100 },
  { stage: 'recovering', label: 'Recovering deleted clips…', durationMs: 1300 },
  { stage: 'correlating',label: 'Correlating timeline…',    durationMs: 900  },
  { stage: 'complete',   label: 'Analysis complete',         durationMs: 0    },
]

interface UsePipelineStatusReturn {
  stage: PipelineStage
  stageLabel: string
  progress: number        // 0-100
  isRunning: boolean
  startPipeline: () => void
  reset: () => void
}

export function usePipelineStatus(): UsePipelineStatusReturn {
  const [stage, setStage] = useState<PipelineStage>('idle')
  const [stageLabel, setStageLabel] = useState('Ready')
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startPipeline = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setProgress(0)

    let stepIndex = 0
    const totalSteps = PIPELINE_STEPS.length - 1 // exclude 'complete'

    const runStep = () => {
      if (stepIndex >= PIPELINE_STEPS.length) return
      const step = PIPELINE_STEPS[stepIndex]
      setStage(step.stage)
      setStageLabel(step.label)
      setProgress(Math.round((stepIndex / totalSteps) * 100))

      if (step.stage === 'complete') {
        setProgress(100)
        setIsRunning(false)
        return
      }

      stepIndex++
      timerRef.current = setTimeout(runStep, step.durationMs)
    }

    runStep()
  }, [isRunning])

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStage('idle')
    setStageLabel('Ready')
    setProgress(0)
    setIsRunning(false)
  }, [])

  return { stage, stageLabel, progress, isRunning, startPipeline, reset }
}
