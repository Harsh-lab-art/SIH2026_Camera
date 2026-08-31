// ============================================================
// Core domain types — derived from the Python pipeline output
// ============================================================

export type CustodyAction =
  | 'CASE_OPENED'
  | 'DEVICE_RECEIVED'
  | 'ORIGINAL_HASHED'
  | 'IMAGE_ACQUIRED'
  | 'IMAGE_HASHED'
  | 'INTEGRITY_CHECK'
  | 'VENDOR_IDENTIFIED'
  | 'CLIPS_EXTRACTED'
  | 'DELETED_RECOVERY'
  | 'TIMELINE_BUILT'
  | 'CUSTODY_CHAIN_VERIFIED'

export interface CustodyEntry {
  seq: number
  timestamp: string
  action: CustodyAction
  detail: string
  prev_hash: string
  entry_hash: string
}

export interface DeviceInfo {
  vendor: string
  model: string
  signature?: string
}

export interface HashSet {
  md5: string
  sha256: string
}

export interface IntegrityResult {
  original: HashSet
  image: HashSet
  match: boolean
}

export type Codec = 'H.264' | 'H.265' | 'MJPEG'

export interface Clip {
  id: string
  camera: string
  startTime: string         // ISO string
  durationSec: number
  codec: Codec
  path?: string
}

export type RecoveryConfidence = 'high' | 'medium' | 'low'

export interface RecoveredClip {
  id: string
  camera: string
  startTime: string
  durationSec?: number
  method: string
  confidence: RecoveryConfidence
}

export interface TimelineEvent {
  time: string              // ISO normalized UTC
  camera: string
  type: 'extracted' | 'recovered'
  clipId: string
  confidence?: RecoveryConfidence
}

export type PipelineStage =
  | 'idle'
  | 'receiving'
  | 'hashing'
  | 'imaging'
  | 'verifying'
  | 'parsing'
  | 'recovering'
  | 'correlating'
  | 'complete'

export interface CaseData {
  caseId: string
  description: string
  createdAt: string
  device: DeviceInfo
  integrity: IntegrityResult
  clips: Clip[]
  recovered: RecoveredClip[]
  timeline: TimelineEvent[]
  custodyChain: CustodyEntry[]
  chainVerified: boolean
  clockOffsetSec: number
}

export type Page = 'dashboard' | 'acquisition' | 'device' | 'clips' | 'recovery' | 'timeline' | 'custody' | 'report'
