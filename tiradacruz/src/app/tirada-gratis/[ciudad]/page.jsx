import { notFound } from 'next/navigation'
import ciudades from '@/data/ciudades.json'
import tiposTirada from '@/data/tipos-tirada.json'
import { SITE_URL } from '@/lib/seo-utils'
import ModoApp from '@/components/ModoApp'
import Footer from '@/components/landing/Footer'

export async function generateStaticParams() {
  return ciudades.map((c) => ({ ciudad: c.id }))
}

export async function generateMetadata({ params }) {
  const { ciudad } = await params
  const loc = ciudades.find((c) => c.id === ciudad)
  if (!loc) return {}

  const title = `Tirada de Cartas Gratis en ${loc.nombre} | Española y Tarot con IA`
  const description = `Tirada de cartas gratis en ${loc.nombre}. Baraja española y tarot con interpretación por inteligencia artificial. Sin registro. TiradaCruz — Argentina.`

  return {
    title,
    description,
    keywords: [`tirada de cartas gratis ${loc.nombre}`, `tirada gratis ${loc.nombre}`, `cartas online ${loc.provincia}`, 'tirada de cartas gratis argentina', 'tarot gratis'],
    alternates: { canonical: `${SITE_URL}/tirada-gratis/${ciudad}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tirada-gratis/${ciudad}`,
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
        <p className="text-sm font-medium mb-2" style={{ color: "#fbbf24" }}>
          🃏 {loc.nombre}, {loc.provincia}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Tirada de Cartas Gratis en {loc.nombre}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">{loc.contexto_local}</p>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-16">
        <div className="mt-6">
          <ModoApp />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-3">
            Las cartas hablan desde {loc.nombre}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Realizá tu tirada de cartas gratis en {loc.nombre} con baraja española o tarot.
            La inteligencia artificial interpreta cada tirada en función de tu pregunta.
            Sin registro, sin límites, completamente gratis.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-slate-500 mb-3">Tiradas por tema</h2>
          <div className="flex flex-wrap gap-2">
            {tiposTirada.map((t) => (
              <a
                key={t.id}
                href={`/tirada-de-cartas-espanolas/${t.id}/${ciudad}`}
                className="text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{ background: "rgba(217,119,6,0.08)", color: "#fbbf24", border: "1px solid rgba(217,119,6,0.18)" }}
              >
                {t.icono} Cartas de {t.nombre}
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
