import { notFound } from 'next/navigation'
import ciudades from '@/data/ciudades.json'
import tiposTirada from '@/data/tipos-tirada.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaTarot from '@/components/tarot/TiradaTarot'
import Footer from '@/components/landing/Footer'

export async function generateStaticParams() {
  return ciudades.map((c) => ({ ciudad: c.id }))
}

export async function generateMetadata({ params }) {
  const { ciudad } = await params
  const loc = ciudades.find((c) => c.id === ciudad)
  if (!loc) return {}

  const title = `Tarot Gratis en ${loc.nombre} | Arcanos Online con IA`
  const description = `Tarot gratis en ${loc.nombre} con interpretación por inteligencia artificial. Arcanos mayores y baraja completa. Sin registro. TiradaCruz — el tarot online de Argentina.`

  return {
    title,
    description,
    keywords: [`tarot gratis ${loc.nombre}`, `tarot ${loc.nombre}`, `tarot online ${loc.provincia}`, 'tarot gratis argentina', 'arcanos mayores gratis'],
    alternates: { canonical: `${SITE_URL}/tarot-gratis/${ciudad}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tarot-gratis/${ciudad}`,
      type: 'website',
      locale: 'es_AR',
      siteName: 'TiradaCruz',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page({ params }) {
  const { ciudad } = await params
  const loc = ciudades.find((c) => c.id === ciudad)
  if (!loc) notFound()

  return (
    <div className="min-h-screen bg-[#050509]">
      <header className="text-center py-8 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          ← TiradaCruz
        </a>
        <p className="text-sm font-medium mb-2" style={{ color: "#a78bfa" }}>
          🔮 {loc.nombre}, {loc.provincia}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Tarot Gratis en {loc.nombre}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">{loc.contexto_local}</p>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-16">
        <div className="mt-6">
          <TiradaTarot />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-3">
            El tarot online más completo para {loc.nombre}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            Realizá tu tirada de tarot gratis en {loc.nombre} con arcanos mayores o la baraja completa de 78 cartas.
            La inteligencia artificial interpreta cada combinación en función de tu pregunta, dando una lectura
            personalizada y honesta, sin filtros.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            No importa si estás en el centro de {loc.nombre} o en un barrio alejado — las cartas no entienden
            de distancias. Lo que sí importa es la claridad de tu pregunta y la apertura para recibir el mensaje.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-slate-500 mb-3">Tiradas por tema en {loc.nombre}</h2>
          <div className="flex flex-wrap gap-2">
            {tiposTirada.map((t) => (
              <a
                key={t.id}
                href={`/tirada-de-tarot/${t.id}/${ciudad}`}
                className="text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{ background: "rgba(124,58,237,0.08)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.18)" }}
              >
                {t.icono} Tarot de {t.nombre}
              </a>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-700 mt-10 text-center">
          Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales médicos, legales ni financieros.
        </p>
      </main>

      <Footer />
    </div>
  )
}
