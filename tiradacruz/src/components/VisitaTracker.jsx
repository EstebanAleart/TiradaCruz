'use client'

import { useEffect } from 'react'

export default function VisitaTracker({ data }) {
  useEffect(() => {
    fetch('/api/analytics/visita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {})
  }, [])

  return null
}
