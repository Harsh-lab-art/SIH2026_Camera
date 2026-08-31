import { CaseData } from '../types'
import chainJson from '../../chain.json'
import { CustodyEntry } from '../types'

// ----------------------------------------------------------------
// Parse the chain.json custody entries
// ----------------------------------------------------------------
const rawChain = chainJson as CustodyEntry[]

// ----------------------------------------------------------------
// Static case data derived from forensic_report.md + chain.json
// In a real integration, this would be fetched from the Python API
// ----------------------------------------------------------------
export const CASE_DATA: CaseData = {
  caseId: 'CASE001',
  description: 'Simulated shop theft investigation',
  createdAt: '2026-08-31T13:43:53.086Z',

  device: {
    vendor: 'CP Plus',
    model: 'CP-X2-NVR',
    signature: 'CPP_VOLHDR',
  },

  integrity: {
    original: {
      md5: 'aec2008e4d6ee7324d9e87992311dd80',
      sha256: 'cad7aa90a34da45717f30555f112392e1fa0187943cd0634e3dedfb79f046d7e',
    },
    image: {
      md5: 'aec2008e4d6ee7324d9e87992311dd80',
      sha256: 'cad7aa90a34da45717f30555f112392e1fa0187943cd0634e3dedfb79f046d7e',
    },
    match: true,
  },

  clips: [
    { id: 'CH1_000', camera: 'Camera 1', startTime: '2026-08-20T18:00:00Z', durationSec: 300, codec: 'H.264', path: 'case001_output/clip_000.mp4.dummy' },
    { id: 'CH2_001', camera: 'Camera 2', startTime: '2026-08-20T18:07:00Z', durationSec: 300, codec: 'H.264', path: 'case001_output/clip_001.mp4.dummy' },
    { id: 'CH1_002', camera: 'Camera 1', startTime: '2026-08-20T18:14:00Z', durationSec: 120, codec: 'H.264', path: 'case001_output/clip_002.mp4.dummy' },
    { id: 'CH2_003', camera: 'Camera 2', startTime: '2026-08-20T18:21:00Z', durationSec: 180, codec: 'H.264', path: 'case001_output/clip_003.mp4.dummy' },
  ],

  recovered: [
    {
      id: 'RECOVERED_000',
      camera: 'Camera 1',
      startTime: '2026-08-20T19:10:00Z',
      method: 'Unallocated-space carving (H.264 NAL signature match)',
      confidence: 'medium',
    },
    {
      id: 'RECOVERED_001',
      camera: 'Camera 2',
      startTime: '2026-08-20T19:14:00Z',
      method: 'Unallocated-space carving (H.264 NAL signature match)',
      confidence: 'high',
    },
  ],

  timeline: [
    { time: '2026-08-20T17:59:23Z', camera: 'Camera 1', type: 'extracted', clipId: 'CH1_000' },
    { time: '2026-08-20T18:06:23Z', camera: 'Camera 2', type: 'extracted', clipId: 'CH2_001' },
    { time: '2026-08-20T18:13:23Z', camera: 'Camera 1', type: 'extracted', clipId: 'CH1_002' },
    { time: '2026-08-20T18:20:23Z', camera: 'Camera 2', type: 'extracted', clipId: 'CH2_003' },
    { time: '2026-08-20T19:09:23Z', camera: 'Camera 1', type: 'recovered', clipId: 'RECOVERED_000', confidence: 'medium' },
    { time: '2026-08-20T19:13:23Z', camera: 'Camera 2', type: 'recovered', clipId: 'RECOVERED_001', confidence: 'high' },
  ],

  custodyChain: rawChain,
  chainVerified: true,
  clockOffsetSec: -37,
}
