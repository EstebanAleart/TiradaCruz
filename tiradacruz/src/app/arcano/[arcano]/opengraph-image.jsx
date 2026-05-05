import { ImageResponse } from 'next/og'
import arcanos from '@/data/arcanos.json'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { arcano } = await params
  const arc = arcanos.find((a) => a.id === arcano)

  const nombre = arc?.nombre ?? arcano
  const numero = arc != null ? arc.numero : ''
  const significado = arc?.significado_corto ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d0520 0%, #1e0f3a 50%, #0d0520 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#9b59b6', fontSize: 20, letterSpacing: 4, display: 'flex' }}>
            ARCANO MAYOR · N° {numero}
          </div>

          <div
            style={{
              color: '#e8d5ff',
              fontSize: 72,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.1,
              display: 'flex',
            }}
          >
            {nombre}
          </div>

          <div
            style={{
              color: '#b09abf',
              fontSize: 26,
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            {significado}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: '10px 28px',
              background: 'rgba(155, 89, 182, 0.12)',
              border: '1px solid rgba(155, 89, 182, 0.35)',
              borderRadius: 40,
              color: '#c8a0e0',
              fontSize: 18,
              display: 'flex',
            }}
          >
            TiradaCruz · Tarot Online Gratis 🇦🇷
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 5,
            background: 'linear-gradient(90deg, #9b59b6, #6c3483, #9b59b6)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
