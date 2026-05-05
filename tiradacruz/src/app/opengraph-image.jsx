import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TiradaCruz - Tarot Online Gratis Argentina'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%)',
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
          <div style={{ fontSize: 72, lineHeight: 1, display: 'flex' }}>🃏</div>

          <div
            style={{
              color: '#f5c842',
              fontSize: 64,
              fontWeight: 'bold',
              letterSpacing: '-1px',
              display: 'flex',
            }}
          >
            TiradaCruz
          </div>

          <div
            style={{
              color: '#e8d5b0',
              fontSize: 28,
              textAlign: 'center',
              maxWidth: 720,
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            Tarot y Cartas Españolas Online Gratis
          </div>

          <div
            style={{
              color: '#b09abf',
              fontSize: 20,
              marginTop: 8,
              display: 'flex',
            }}
          >
            Interpretación con IA · Argentina 🇦🇷
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #f5c842, #e8a020, #f5c842)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
