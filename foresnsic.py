"""
DVR/NVR MULTI-VENDOR FORENSIC ANALYSIS TOOL — DUMMY END-TO-END PIPELINE
=========================================================================
This is a WORKING SKELETON of the full project. Every module below runs
for real (real hashing, real file I/O, real log/report generation), but
the vendor-specific "hard" parts (filesystem parsing, video decoding,
deleted-file carving) are SIMULATED with fake/dummy data, since those
require real DVR disk images and vendor reverse-engineering to do for
real.

Purpose: demonstrate the complete pipeline architecture end-to-end, in
a form you can run, extend one module at a time, and demo live.

Modules, in pipeline order:
  1. DeviceIdentifier   - fingerprints which vendor/model made the disk
  2. Acquirer            - forensic imaging + hashing (this part is REAL)
  3. FormatParser         - vendor-specific parsing (SIMULATED)
  4. RecoveryEngine       - deleted footage carving (SIMULATED)
  5. TimelineCorrelator   - normalizes timestamps across cameras (REAL logic, dummy data)
  6. ChainOfCustody       - immutable, hash-chained audit log (REAL)
  7. ReportGenerator      - final case report (REAL)

Run:  python3 dvr_forensic_pipeline_demo.py
"""

import hashlib
import json
import os
import random
import time
from datetime import datetime, timedelta

CASE_DIR = "case001_output"
os.makedirs(CASE_DIR, exist_ok=True)


# ---------------------------------------------------------------------------
# Shared: Chain of Custody (hash-chained audit log)
# ---------------------------------------------------------------------------
class ChainOfCustody:
    """
    Append-only audit log. Each entry stores the hash of the previous
    entry, so if anyone edits an earlier entry later, every hash after
    it breaks — tamper-evidence without needing a real blockchain.
    """

    def __init__(self):
        self.entries = []
        self._prev_hash = "0" * 64  # genesis hash

    def log(self, action: str, detail: str = ""):
        entry = {
            "seq": len(self.entries) + 1,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "action": action,
            "detail": detail,
            "prev_hash": self._prev_hash,
        }
        entry_str = json.dumps(entry, sort_keys=True)
        entry_hash = hashlib.sha256(entry_str.encode()).hexdigest()
        entry["entry_hash"] = entry_hash
        self._prev_hash = entry_hash
        self.entries.append(entry)
        print(f"[custody] #{entry['seq']:02d} {action} — {detail}")

    def verify_chain(self) -> bool:
        prev = "0" * 64
        for e in self.entries:
            check = {k: v for k, v in e.items() if k != "entry_hash"}
            recomputed = hashlib.sha256(json.dumps(check, sort_keys=True).encode()).hexdigest()
            if recomputed != e["entry_hash"] or e["prev_hash"] != prev:
                return False
            prev = e["entry_hash"]
        return True

    def save(self, path):
        with open(path, "w") as f:
            json.dump(self.entries, f, indent=2)


# ---------------------------------------------------------------------------
# Module 1: Device Identification
# ---------------------------------------------------------------------------
class DeviceIdentifier:
    """
    Real version: reads known byte signatures / partition headers from the
    raw disk and matches against a signature database.
    Dummy version: picks from a small fake signature table.
    """

    SIGNATURE_DB = {
        b"DH_FS_MAGIC": "Dahua Technology",
        b"HIK_PART_TAG": "HIKVISION",
        b"CPP_VOLHDR": "CP Plus",
        b"UNV_INDEX01": "Uniview",
    }

    def identify(self, disk_image_path: str):
        # Dummy: simulate reading the first N bytes and matching a signature.
        fake_signature = random.choice(list(self.SIGNATURE_DB.keys()))
        vendor = self.SIGNATURE_DB[fake_signature]
        model_guess = f"{vendor.split()[0]}-{random.choice(['DS4108', 'X2-NVR', 'NV3216'])}"
        return {"vendor": vendor, "model": model_guess, "signature": fake_signature.decode()}


# ---------------------------------------------------------------------------
# Module 2: Acquisition (this part is genuinely real — same as the earlier demo)
# ---------------------------------------------------------------------------
class Acquirer:
    def create_simulated_disk(self, path, size_mb=5):
        if not os.path.exists(path):
            with open(path, "wb") as f:
                f.write(os.urandom(size_mb * 1024 * 1024))

    def hash_file(self, path):
        md5, sha256 = hashlib.md5(), hashlib.sha256()
        with open(path, "rb") as f:
            while chunk := f.read(4 * 1024 * 1024):
                md5.update(chunk)
                sha256.update(chunk)
        return md5.hexdigest(), sha256.hexdigest()

    def acquire(self, source_path, image_path):
        with open(source_path, "rb") as src, open(image_path, "wb") as dst:
            while chunk := src.read(4 * 1024 * 1024):
                dst.write(chunk)


# ---------------------------------------------------------------------------
# Module 3: Format Parsing (SIMULATED — real one needs reverse-engineered vendor logic)
# ---------------------------------------------------------------------------
class FormatParser:
    def parse(self, vendor: str, num_clips: int = 4):
        clips = []
        base_time = datetime(2026, 8, 20, 18, 0, 0)
        for i in range(num_clips):
            clips.append({
                "clip_id": f"CH{i % 2 + 1}_{i:03d}",
                "camera": f"Camera {i % 2 + 1}",
                "start_time_raw": (base_time + timedelta(minutes=7 * i)).isoformat(),
                "duration_sec": random.choice([120, 180, 300]),
                "codec": "H.264",
                "extracted_path": os.path.join(CASE_DIR, f"clip_{i:03d}.mp4.dummy"),
            })
            # touch a placeholder file so the pipeline output feels real
            with open(clips[-1]["extracted_path"], "w") as f:
                f.write("DUMMY EXTRACTED VIDEO PLACEHOLDER\n")
        return clips


# ---------------------------------------------------------------------------
# Module 4: Deleted Recovery (SIMULATED — real one needs signature-based carving)
# ---------------------------------------------------------------------------
class RecoveryEngine:
    def carve(self, num_recovered: int = 2):
        recovered = []
        base_time = datetime(2026, 8, 20, 19, 10, 0)
        for i in range(num_recovered):
            recovered.append({
                "clip_id": f"RECOVERED_{i:03d}",
                "camera": f"Camera {i % 2 + 1}",
                "start_time_raw": (base_time + timedelta(minutes=4 * i)).isoformat(),
                "duration_sec": random.choice([60, 90]),
                "recovery_method": "unallocated-space carving (H.264 NAL signature match)",
                "confidence": random.choice(["high", "medium"]),
            })
        return recovered


# ---------------------------------------------------------------------------
# Module 5: Timeline Correlation
# ---------------------------------------------------------------------------
class TimelineCorrelator:
    def correlate(self, clips, recovered, clock_offset_sec=-37):
        """
        Dummy clock drift correction: this DVR's clock was found to be
        37 seconds fast, so we subtract that offset from every timestamp
        to normalize to real-world UTC before building the combined timeline.
        """
        timeline = []
        for c in clips:
            t = datetime.fromisoformat(c["start_time_raw"]) + timedelta(seconds=clock_offset_sec)
            timeline.append({"time": t.isoformat(), "camera": c["camera"], "event": f"Recording: {c['clip_id']}"})
        for r in recovered:
            t = datetime.fromisoformat(r["start_time_raw"]) + timedelta(seconds=clock_offset_sec)
            timeline.append({"time": t.isoformat(), "camera": r["camera"], "event": f"Recovered: {r['clip_id']} ({r['confidence']} confidence)"})
        timeline.sort(key=lambda x: x["time"])
        return timeline


# ---------------------------------------------------------------------------
# Module 6: Reporting
# ---------------------------------------------------------------------------
class ReportGenerator:
    def generate(self, case_id, device_info, hashes, clips, recovered, timeline, custody_verified, path):
        lines = []
        lines.append(f"# Forensic Analysis Report — Case {case_id}\n")
        lines.append(f"Generated: {datetime.utcnow().isoformat()}Z\n")

        lines.append("## Device Identification\n")
        lines.append(f"- Vendor: {device_info['vendor']}")
        lines.append(f"- Model (best guess): {device_info['model']}\n")

        lines.append("## Acquisition Integrity\n")
        lines.append(f"- Original MD5:    {hashes['orig_md5']}")
        lines.append(f"- Image MD5:       {hashes['image_md5']}")
        lines.append(f"- Original SHA256: {hashes['orig_sha256']}")
        lines.append(f"- Image SHA256:    {hashes['image_sha256']}")
        lines.append(f"- Verified match:  {hashes['verified']}\n")

        lines.append("## Extracted Recordings\n")
        for c in clips:
            lines.append(f"- {c['clip_id']} | {c['camera']} | {c['start_time_raw']} | {c['duration_sec']}s | {c['codec']}")
        lines.append("")

        lines.append("## Recovered (Deleted) Recordings\n")
        for r in recovered:
            lines.append(f"- {r['clip_id']} | {r['camera']} | {r['start_time_raw']} | {r['recovery_method']} | confidence: {r['confidence']}")
        lines.append("")

        lines.append("## Correlated Timeline (clock-drift normalized)\n")
        for t in timeline:
            lines.append(f"- {t['time']} — {t['camera']} — {t['event']}")
        lines.append("")

        lines.append("## Chain of Custody\n")
        lines.append(f"- Hash chain integrity verified: {custody_verified}\n")

        with open(path, "w") as f:
            f.write("\n".join(lines))


# ---------------------------------------------------------------------------
# Orchestrator — runs the full dummy pipeline end to end
# ---------------------------------------------------------------------------
def run_pipeline():
    custody = ChainOfCustody()
    custody.log("CASE_OPENED", "Case001 — simulated shop theft investigation")

    # Module 2 (partially real): create + image a fake disk
    acquirer = Acquirer()
    source_path = os.path.join(CASE_DIR, "simulated_dvr_disk.bin")
    image_path = os.path.join(CASE_DIR, "case001_disk.dd")
    acquirer.create_simulated_disk(source_path)
    custody.log("DEVICE_RECEIVED", "Simulated DVR hard disk received for imaging")

    orig_md5, orig_sha256 = acquirer.hash_file(source_path)
    custody.log("ORIGINAL_HASHED", f"MD5={orig_md5}")

    acquirer.acquire(source_path, image_path)
    custody.log("IMAGE_ACQUIRED", f"Forensic image written to {image_path}")

    image_md5, image_sha256 = acquirer.hash_file(image_path)
    custody.log("IMAGE_HASHED", f"MD5={image_md5}")

    verified = (orig_md5 == image_md5) and (orig_sha256 == image_sha256)
    custody.log("INTEGRITY_CHECK", f"Match: {verified}")

    # Module 1: identify vendor
    identifier = DeviceIdentifier()
    device_info = identifier.identify(image_path)
    custody.log("VENDOR_IDENTIFIED", f"{device_info['vendor']} / {device_info['model']}")

    # Module 3: parse + extract clips (simulated)
    parser = FormatParser()
    clips = parser.parse(device_info["vendor"])
    custody.log("CLIPS_EXTRACTED", f"{len(clips)} recordings extracted")

    # Module 4: recover deleted footage (simulated)
    recovery = RecoveryEngine()
    recovered = recovery.carve()
    custody.log("DELETED_RECOVERY", f"{len(recovered)} deleted clips recovered")

    # Module 5: correlate timeline
    correlator = TimelineCorrelator()
    timeline = correlator.correlate(clips, recovered)
    custody.log("TIMELINE_BUILT", f"{len(timeline)} events correlated across cameras")

    # Verify the custody chain itself before finalizing
    chain_ok = custody.verify_chain()
    custody.log("CUSTODY_CHAIN_VERIFIED", str(chain_ok))

    # Save custody log
    custody_path = os.path.join(CASE_DIR, "chain_of_custody.json")
    custody.save(custody_path)

    # Module 6/7: final report
    report_path = os.path.join(CASE_DIR, "forensic_report.md")
    ReportGenerator().generate(
        case_id="CASE001",
        device_info=device_info,
        hashes={
            "orig_md5": orig_md5, "image_md5": image_md5,
            "orig_sha256": orig_sha256, "image_sha256": image_sha256,
            "verified": verified,
        },
        clips=clips,
        recovered=recovered,
        timeline=timeline,
        custody_verified=chain_ok,
        path=report_path,
    )

    print(f"\n[done] Report: {report_path}")
    print(f"[done] Custody log: {custody_path}")


if __name__ == "__main__":
    run_pipeline()