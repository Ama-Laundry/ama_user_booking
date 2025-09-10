import { useEffect, useMemo, useRef, useState } from 'react'

const API_BASE = import.meta.env.VITE_WP_BASE_URL?.replace(/\/$/, '') || ''

const endpoints = [
  // Custom endpoint (if you have one)
  `${API_BASE}/wp-json/ama/v1/time-slots`,
  // CPT: timeslot (publish records)
  `${API_BASE}/wp-json/wp/v2/timeslot?per_page=100&status=publish`,
  // ACF Options (time slots stored in options page)
  `${API_BASE}/wp-json/acf/v3/options/options`,
]

// Normalize a value like "08:00"
function normalizeValue(v) {
  if (!v) return ''
  const m = String(v).match(/^(\d{1,2}):?(\d{2})$/)
  if (m) {
    const h = String(m[1]).padStart(2, '0')
    const mm = String(m[2]).padStart(2, '0')
    return `${h}:${mm}`
  }
  return String(v)
}

// Sort by time (HH:MM)
function sortByTime(a, b) {
  const [ah, am] = a.value.split(':').map(Number)
  const [bh, bm] = b.value.split(':').map(Number)
  return ah === bh ? am - bm : ah - bh
}

// Map from CPT items
function mapFromCPT(items = []) {
  return items
    .filter(it => it?.status === 'publish' || it?.status == null)
    .map(it => {
      const a = it.acf || {}
      const value = normalizeValue(a.value || a.time || it.slug || it.title?.rendered)
      const label = a.label || it.title?.rendered || value
      const enabled = a.enabled !== false // default true
      return { id: it.id, value, label, enabled }
    })
    .filter(x => x.enabled && x.value)
    .sort(sortByTime)
}

// Map from ACF options
function mapFromOptions(obj = {}) {
  const a = obj.acf || {}
  const raw = a.time_slots || a.slots || []
  return (Array.isArray(raw) ? raw : [])
    .map((row, idx) => {
      const value = normalizeValue(row.value || row.time || row?.start)
      const label = row.label || row.name || value
      const enabled = row.enabled !== false
      return { id: row.id || idx, value, label, enabled }
    })
    .filter(x => x.enabled && x.value)
    .sort(sortByTime)
}

export default function useTimeSlots() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const abortRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    abortRef.current = controller

    async function load() {
      setLoading(true)
      setError('')
      setSlots([])
      for (const url of endpoints) {
        if (!url) continue
        try {
          const res = await fetch(url, { signal: controller.signal })
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          const data = await res.json()

          // Decide mapper
          let mapped = []
          if (Array.isArray(data)) {
            mapped = mapFromCPT(data)
          } else if (data && typeof data === 'object') {
            // Could be ACF options or custom payload
            if (data.acf) {
              mapped = mapFromOptions(data)
            } else if (Array.isArray(data.slots)) {
              mapped = data.slots
                .map((s, i) => ({
                  id: s.id || i,
                  value: normalizeValue(s.value || s.time),
                  label: s.label || s.name || normalizeValue(s.value || s.time),
                  enabled: s.enabled !== false
                }))
                .filter(x => x.enabled && x.value)
                .sort(sortByTime)
            }
          }

          if (mapped.length > 0) {
            if (!cancelled) setSlots(mapped)
            break
          }
        } catch (e) {
          // try next endpoint
          continue
        }
      }
      if (!cancelled) setLoading(false)
      if (!cancelled && slots.length === 0) {
        setError('No pickup time slots available.')
      }
    }

    load()
    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE])

  const reload = useMemo(() => () => {
    if (abortRef.current) abortRef.current.abort()
    // trigger effect by toggling a state or rely on unmount/mount
    window.location.reload()
  }, [])

  return { slots, loading, error, reload }
}
