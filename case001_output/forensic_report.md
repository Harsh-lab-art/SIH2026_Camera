# Forensic Analysis Report — Case CASE001

Generated: 2026-08-31T16:02:47.942498Z

## Device Identification

- Vendor: CP Plus
- Model (best guess): CP-X2-NVR

## Acquisition Integrity

- Original MD5:    aec2008e4d6ee7324d9e87992311dd80
- Image MD5:       aec2008e4d6ee7324d9e87992311dd80
- Original SHA256: cad7aa90a34da45717f30555f112392e1fa0187943cd0634e3dedfb79f046d7e
- Image SHA256:    cad7aa90a34da45717f30555f112392e1fa0187943cd0634e3dedfb79f046d7e
- Verified match:  True

## Extracted Recordings

- CH1_000 | Camera 1 | 2026-08-20T18:00:00 | 120s | H.264
- CH2_001 | Camera 2 | 2026-08-20T18:07:00 | 120s | H.264
- CH1_002 | Camera 1 | 2026-08-20T18:14:00 | 300s | H.264
- CH2_003 | Camera 2 | 2026-08-20T18:21:00 | 300s | H.264

## Recovered (Deleted) Recordings

- RECOVERED_000 | Camera 1 | 2026-08-20T19:10:00 | unallocated-space carving (H.264 NAL signature match) | confidence: medium
- RECOVERED_001 | Camera 2 | 2026-08-20T19:14:00 | unallocated-space carving (H.264 NAL signature match) | confidence: medium

## Correlated Timeline (clock-drift normalized)

- 2026-08-20T17:59:23 — Camera 1 — Recording: CH1_000
- 2026-08-20T18:06:23 — Camera 2 — Recording: CH2_001
- 2026-08-20T18:13:23 — Camera 1 — Recording: CH1_002
- 2026-08-20T18:20:23 — Camera 2 — Recording: CH2_003
- 2026-08-20T19:09:23 — Camera 1 — Recovered: RECOVERED_000 (medium confidence)
- 2026-08-20T19:13:23 — Camera 2 — Recovered: RECOVERED_001 (medium confidence)

## Chain of Custody

- Hash chain integrity verified: True
