export function trackEvento(accion) {
  if (typeof window === 'undefined') return
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return
  fetch('/api/analytics/visita', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ruta: `evento/${accion}`, modo: 'evento' }),
  }).catch(() => {})
}
