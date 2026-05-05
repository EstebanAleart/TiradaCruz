import { notFound } from 'next/navigation'
import tiposTirada from '@/data/tipos-tirada.json'
import ciudades from '@/data/ciudades.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaEspanola from '@/components/espanolas/TiradaEspanola'
import Footer from '@/components/landing/Footer'

export async function generateStaticParams() {
  return tiposTirada.map((tipo) => ({ tipo: tipo.id }))
}

export async function generateMetadata({ params }) {
  const { tipo } = await params
  const tip = tiposTirada.find((t) => t.id === tipo)
  if (!tip) return {}

  const title = `Tirada de Cartas de ${tip.nombre} | Baraja Española Gratis con IA`
  const description = `${tip.descripcion_seo} Tirada en cruz con baraja española, interpretación por IA al instante. Gratis y sin registro. TiradaCruz Argentina.`

  return {
    title,
    description,
    keywords: [...tip.palabras_clave, 'tirada de cartas gratis', 'baraja española online', 'tarot argentina', 'cartas gratis'],
    alternates: { canonical: `${SITE_URL}/tirada-de-cartas-espanolas/${tipo}` },
    openGraph: {
      title,
      description: tip.urgencia,
      url: `${SITE_URL}/tirada-de-cartas-espanolas/${tipo}`,
      type: 'website',
      locale: 'es_AR',
      siteName: 'TiradaCruz',
    },
    twitter: { card: 'summary_large_image', title, description: tip.urgencia },
  }
}

export default async function Page({ params }) {
  const { tipo } = await params
  const tip = tiposTirada.find((t) => t.id === tipo)
  if (!tip) notFound()

  const ciudadesSample = ciudades.slice(0, 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <header className="text-center py-8 px-4 border-b border-amber-200/50">
        <a href="/" className="text-sm text-amber-600 hover:text-amber-800 mb-4 inline-block">
          ← TiradaCruz
        </a>
        <p className="text-sm text-amber-700 mb-2 font-medium">{tip.icono} Baraja Española</p>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
          Tirada de Cartas de {tip.nombre}
        </h1>
        <p className="text-amber-700 max-w-2xl mx-auto text-lg">{tip.descripcion_seo}</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <TiradaEspanola />

        <section className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            Consultá las cartas sobre el {tip.nombre.toLowerCase()}
          </h2>
          <p className="text-amber-800 mb-4">{tip.urgencia}</p>
          <p className="text-amber-800">
            La tirada en cruz con baraja española es una de las herramientas oraculares más precisas para
            consultas de {tip.nombre.toLowerCase()}. Las cinco posiciones revelan el presente, el pasado,
            el futuro, el consejo y el resultado probable de tu situación.
          </p>
        </section>

        <section className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-amber-900 mb-3">
            También disponible por ciudad
          </h2>
          <div className="flex flex-wrap gap-2">
            {ciudadesSample.map((c) => (
              <a
                key={c.id}
                href={`/tirada-de-cartas-espanolas/${tipo}/${c.id}`}
                className="text-sm px-3 py-1.5 bg-white/60 hover:bg-white/90 rounded-full text-amber-800 border border-amber-200 transition-colors"
              >
                {tip.icono} {c.nombre}
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
