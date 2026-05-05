import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req) {
  const host = req.headers.get('host') || ''
  if (host.startsWith('localhost') || host.startsWith('127.')) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  try {
    const body = await req.json()

    const ua = req.headers.get('user-agent') || ''
    const dispositivo = /mobile|android|iphone|ipad/i.test(ua)
      ? 'mobile'
      : /tablet/i.test(ua)
      ? 'tablet'
      : 'desktop'

    const pais = req.headers.get('x-vercel-ip-country') ?? null
    const referrer = req.headers.get('referer') ?? null

    await supabase.from('visitas').insert({
      ruta: body.ruta,
      modo: body.modo ?? null,
      tipo_tirada: body.tipo_tirada ?? null,
      ciudad_id: body.ciudad_id ?? null,
      ciudad_nombre: body.ciudad_nombre ?? null,
      arcano_id: body.arcano_id ?? null,
      carta_id: body.carta_id ?? null,
      dispositivo,
      referrer,
      pais,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
