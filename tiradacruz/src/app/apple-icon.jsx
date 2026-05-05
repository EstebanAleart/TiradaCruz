import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 90, lineHeight: 1 }}>🃏</div>
        <div style={{ color: '#f5c842', fontSize: 22, fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
          TiradaCruz
        </div>
      </div>
    ),
    { ...size }
  )
}
