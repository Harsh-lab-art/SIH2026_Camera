/** Format ISO string to readable date/time */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Format seconds into mm:ss */
export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Truncate hash for display */
export function shortHash(hash: string, len = 12): string {
  if (!hash) return '—'
  return hash.slice(0, len) + '…'
}

/** Format just the time portion HH:MM:SS */
export function formatTime(iso: string): string {
  try {
    return new Date(iso).toUTCString().split(' ')[4] ?? iso
  } catch {
    return iso
  }
}

/** Format just the date YYYY-MM-DD */
export function formatDateOnly(iso: string): string {
  try {
    return iso.slice(0, 10)
  } catch {
    return iso
  }
}
