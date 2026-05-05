import { notFound } from 'next/navigation'
import ciudades from '@/data/ciudades.json'
import tiposTirada from '@/data/tipos-tirada.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaTarot from '@/components/tarot/TiradaTarot'
import Footer from '@/components/landing/Footer'

export async function generateStaticParams() {
  return tiposTirada.flatMap((tipo) =>
    ciudades.map((ciudad) => ({ tipo: tipo.id, ciudad: ciudad.id }))
  )
}

export async function generateMetadata({ params }) {
  const { tipo, ciudad } = await params
  const loc = ciudades.find((c) => c.id === ciudad)
  const tip = tiposTirada.find((t) => t.id === tipo)
  if (!loc || !tip) return {}

  const title = `Tarot de ${tip.nombre} en ${loc.nombre} | Tirada Gratis con IA`
  const description = `¿Querés una tirada de tarot de ${tip.nombre.toLowerCase()} en ${loc.nombre}? ${tip.descripcion_seo} Arcanos mayores y baraja completa. Gratis, sin registro. TiradaCruz.`

  return {
    title,
    description,
    keywords: [
      ...tip.palabras_clave,
      loc.nombre,
      loc.provincia,
      'tarot gratis',
      'tirada de tarot online',
      'tarot arcanos mayores',
      'tarot argentina',
    ],
    alternates: { canonical: `${SITE_URL}/tirada-de-tarot/${tipo}/${ciudad}` },
    openGraph: {
      title,
      description: tip.urgencia,
      url: `${SITE_URL}/tirada-de-tarot/${tipo}/${ciudad}`,
      type: 'website',
      locale: 'es_AR',
      siteName: 'TiradaCruz',
    },
    twitter: { card: 'summary_large_image', title, description: tip.urgencia },
  }
}

export default async function Page({ params }) {
  const { tipo, ciudad } = await params
  const loc = ciudades.find((c) => c.id === ciudad)
  const tip = tiposTirada.find((t) => t.id === tipo)
  if (!loc || !tip) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Tarot de ${tip.nombre} en ${loc.nombre}`,
    description: tip.descripcion_seo,
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
    inLanguage: 'es-AR',
    areaServed: {
      '@type': 'City',
      name: loc.nombre,
      containedInPlace: { '@type': 'State', name: loc.provincia },
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿El tarot sirve para consultas de ${tip.nombre.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tip.descripcion_seo} Los arcanos mayores en particular tienen un simbolismo profundo sobre el ${tip.nombre.toLowerCase()}.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Qué diferencia hay entre arcanos mayores y baraja completa?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los 22 arcanos mayores representan las fuerzas universales y los grandes arquetipos de la vida. La baraja completa de 78 cartas incluye también los arcanos menores, que detallan las situaciones cotidianas con mayor precisión.',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="text-center py-8 px-4 border-b border-amber-200/50">
        <a href="/" className="text-sm text-amber-600 hover:text-amber-800 mb-4 inline-block">
          ← TiradaCruz
        </a>
        <p className="text-sm text-amber-700 mb-2 font-medium">
          🔮 Tarot · {loc.nombre}, {loc.provincia}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
          Tarot de {tip.nombre} en {loc.nombre}
        </h1>
        <p className="text-amber-700 max-w-2xl mx-auto text-lg">{tip.descripcion_seo}</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <TiradaTarot />

        <section className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            Tarot de {tip.nombre.toLowerCase()} desde {loc.nombre}
          </h2>
          <p className="text-amber-800 mb-4">{loc.contexto_local}</p>
          <p className="text-amber-800 mb-4">{tip.urgencia}</p>
          <p className="text-amber-800">
            El tarot en cruz de cinco cartas te da una visión completa de tu situación de {tip.nombre.toLowerCase()}:
            el presente inmediato, las raíces del pasado, lo que viene, el consejo de los arcanos y el resultado
            más probable si seguís el camino actual. Podés elegir entre los 22 arcanos mayores o la baraja
            completa de 78 cartas según la profundidad de lectura que necesitás.
          </p>
        </section>

        <section className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              {
                q: `¿El tarot sirve para consultas de ${tip.nombre.toLowerCase()}?`,
                a: `${tip.descripcion_seo} Los arcanos mayores en particular tienen un simbolismo profundo sobre el ${tip.nombre.toLowerCase()}.`,
              },
              {
                q: '¿Arcanos mayores o baraja completa?',
                a: 'Los 22 arcanos mayores son ideales para una visión general y profunda. La baraja de 78 cartas incluye también los arcanos menores y da respuestas más detalladas sobre las situaciones cotidianas.',
              },
              {
                q: '¿Es gratis la tirada de tarot?',
                a: `Sí, completamente gratis. Sin registro, sin límite de tiradas. Disponible para ${loc.nombre} y toda Argentina.`,
              },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white/60 rounded-lg p-4 cursor-pointer">
                <summary className="font-medium text-amber-900">{q}</summary>
                <p className="mt-2 text-amber-800 text-sm">{a}</p>
              </details>
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
