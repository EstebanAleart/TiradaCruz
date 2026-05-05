import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function login(formData) {
  'use server'
  const pwd = formData.get('pwd')
  if (pwd === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'ok', { httpOnly: true, maxAge: 86400, path: '/' })
  }
  redirect('/admin')
}

async function getStats() {
  const hace30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: porDia }, { data: porRuta }, { data: porCiudad }, { data: porModo }, { data: porDispositivo }, { count: total }] =
    await Promise.all([
      supabase
        .from('visitas')
        .select('created_at')
        .gte('created_at', hace30dias)
        .order('created_at', { ascending: true }),
      supabase
        .from('visitas')
        .select('ruta, tipo_tirada, modo')
        .gte('created_at', hace30dias),
      supabase
        .from('visitas')
        .select('ciudad_nombre')
        .gte('created_at', hace30dias)
        .not('ciudad_nombre', 'is', null),
      supabase
        .from('visitas')
        .select('modo')
        .gte('created_at', hace30dias),
      supabase
        .from('visitas')
        .select('dispositivo')
        .gte('created_at', hace30dias),
      supabase
        .from('visitas', { count: 'exact', head: true })
        .gte('created_at', hace30dias),
    ])

  const visitasPorDia = {}
  for (const v of porDia ?? []) {
    const dia = v.created_at.slice(0, 10)
    visitasPorDia[dia] = (visitasPorDia[dia] ?? 0) + 1
  }

  const conteoRutas = {}
  for (const v of porRuta ?? []) {
    conteoRutas[v.ruta] = (conteoRutas[v.ruta] ?? 0) + 1
  }
  const topRutas = Object.entries(conteoRutas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  const conteoCiudades = {}
  for (const v of porCiudad ?? []) {
    if (v.ciudad_nombre) conteoCiudades[v.ciudad_nombre] = (conteoCiudades[v.ciudad_nombre] ?? 0) + 1
  }
  const topCiudades = Object.entries(conteoCiudades)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const modos = {}
  for (const v of porModo ?? []) {
    modos[v.modo ?? 'desconocido'] = (modos[v.modo ?? 'desconocido'] ?? 0) + 1
  }

  const dispositivos = {}
  for (const v of porDispositivo ?? []) {
    dispositivos[v.dispositivo ?? 'desconocido'] = (dispositivos[v.dispositivo ?? 'desconocido'] ?? 0) + 1
  }

  return { total: total ?? 0, visitasPorDia, topRutas, topCiudades, modos, dispositivos }
}

export default async function AdminPage({ searchParams }) {
  const cookieStore = await cookies()
  const autenticado = cookieStore.get('admin_auth')?.value === 'ok'

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <form action={login} className="bg-gray-900 p-8 rounded-xl flex flex-col gap-4 w-80">
          <h1 className="text-white text-xl font-bold text-center">Admin TiradaCruz</h1>
          <input
            type="password"
            name="pwd"
            placeholder="Contraseña"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none"
            autoFocus
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg">
            Entrar
          </button>
        </form>
      </div>
    )
  }

  const { total, visitasPorDia, topRutas, topCiudades, modos, dispositivos } = await getStats()

  const dias = Object.entries(visitasPorDia).slice(-14)
  const maxDia = Math.max(...dias.map(([, v]) => v), 1)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard · TiradaCruz</h1>
          <span className="text-gray-400 text-sm">Últimos 30 días</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total visitas</p>
            <p className="text-3xl font-bold text-amber-400">{total}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Española</p>
            <p className="text-3xl font-bold text-amber-400">{modos['espanola'] ?? 0}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Tarot</p>
            <p className="text-3xl font-bold text-purple-400">{modos['tarot'] ?? 0}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Mobile</p>
            <p className="text-3xl font-bold text-blue-400">
              {dispositivos['mobile'] && total > 0 ? Math.round((dispositivos['mobile'] / total) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Visitas últimos 14 días</h2>
          <div className="flex items-end gap-1 h-32">
            {dias.map(([dia, count]) => (
              <div key={dia} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{count}</span>
                <div
                  className="w-full bg-amber-500 rounded-t"
                  style={{ height: `${Math.round((count / maxDia) * 100)}%`, minHeight: 2 }}
                />
                <span className="text-xs text-gray-600" style={{ fontSize: 9 }}>
                  {dia.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">Top páginas</h2>
            <div className="space-y-2">
              {topRutas.map(([ruta, count]) => (
                <div key={ruta} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 truncate max-w-[200px]" title={ruta}>{ruta}</span>
                  <span className="text-amber-400 font-mono ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">Top ciudades</h2>
            <div className="space-y-2">
              {topCiudades.map(([ciudad, count]) => (
                <div key={ciudad} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{ciudad}</span>
                  <span className="text-amber-400 font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mt-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Dispositivos</h2>
          <div className="flex gap-6">
            {Object.entries(dispositivos).map(([d, count]) => (
              <div key={d} className="flex items-center gap-2 text-sm">
                <span className="text-gray-300 capitalize">{d}</span>
                <span className="text-amber-400 font-mono">{count}</span>
                {total > 0 && <span className="text-gray-500">({Math.round((count / total) * 100)}%)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
