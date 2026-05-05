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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <header className="text-center py-8 px-4 border-b border-amber-200/50">
        <a href="/" className="text-sm text-amber-600 hover:text-amber-800 mb-4 inline-block">
          ← TiradaCruz
        </a>
        <p className="text-sm text-amber-700 mb-2 font-medium">🃏 {loc.nombre}, {loc.provincia}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
          Tirada de Cartas Gratis en {loc.nombre}
        </h1>
        <p className="text-amber-700 max-w-2xl mx-auto text-lg">{loc.contexto_local}</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <ModoApp />

        <section className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            Las cartas hablan desde {loc.nombre}
          </h2>
          <p className="text-amber-800 mb-4">
            Realizá tu tirada de cartas gratis en {loc.nombre} con baraja española o tarot.
            La inteligencia artificial interpreta cada tirada en función de tu pregunta.
            Sin registro, sin límites, completamente gratis.
          </p>
        </section>

        <section className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-amber-900 mb-3">Tiradas por tema</h2>
          <div className="flex flex-wrap gap-2">
            {tiposTirada.map((t) => (
              <a
                key={t.id}
                href={`/tirada-de-cartas-espanolas/${t.id}/${ciudad}`}
                className="text-sm px-3 py-1.5 bg-white/60 hover:bg-white/90 rounded-full text-amber-800 border border-amber-200 transition-colors"
              >
                {t.icono} Cartas de {t.nombre}
              </a>
            ))}
          </div>
        </section>

        <p className="text-xs text-amber-500 mt-10 text-center max-w-xl mx-auto">
          Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales médicos, legales ni financieros.
        </p>
      </main>

      <Footer />
    </div>
  )
}
