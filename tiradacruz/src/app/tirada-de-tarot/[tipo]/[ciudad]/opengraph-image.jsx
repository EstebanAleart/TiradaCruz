import { ImageResponse } from 'next/og'
import ciudades from '@/data/ciudades.json'
import tiposTirada from '@/data/tipos-tirada.json'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { tipo, ciudad } = await params
  const loc = ciudades.find((c) => c.id === ciudad)
  const tip = tiposTirada.find((t) => t.id === tipo)

  const ciudadNombre = loc?.nombre ?? ciudad
  const tipoNombre = tip?.nombre ?? tipo
  const icono = tip?.icono ?? '🔮'

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 60, display: 'flex' }}>{icono}</div>

          <div style={{ color: '#9b59b6', fontSize: 20, letterSpacing: 3, display: 'flex' }}>
            TAROT · {ciudadNombre.toUpperCase()}
          </div>

          <div
            style={{
              color: '#e8d5ff',
              fontSize: 56,
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: 900,
              display: 'flex',
            }}
          >
            Tarot de {tipoNombre}
          </div>

          <div style={{ color: '#c8a0e0', fontSize: 30, display: 'flex' }}>
            en {ciudadNombre}
          </div>

          <div
            style={{
              marginTop: 8,
              padding: '10px 28px',
              background: 'rgba(155, 89, 182, 0.12)',
              border: '1px solid rgba(155, 89, 182, 0.35)',
              borderRadius: 40,
              color: '#c8a0e0',
              fontSize: 18,
              display: 'flex',
            }}
          >
            TiradaCruz · Arcanos con IA 🇦🇷
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
