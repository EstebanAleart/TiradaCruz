import { notFound } from 'next/navigation'
import ciudades from '@/data/ciudades.json'
import tiposTirada from '@/data/tipos-tirada.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaEspanola from '@/components/espanolas/TiradaEspanola'
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

  const title = `Tirada de Cartas de ${tip.nombre} en ${loc.nombre} | Gratis con IA`
  const description = `¿Querés saber sobre el ${tip.nombre.toLowerCase()} en ${loc.nombre}? ${tip.descripcion_seo} Tirada de baraja española gratis, sin registro. TiradaCruz.`

  return {
    title,
    description,
    keywords: [
      ...tip.palabras_clave,
      loc.nombre,
      loc.provincia,
      'tirada de cartas gratis',
      'baraja española online',
      'tarot gratis argentina',
    ],
    alternates: { canonical: `${SITE_URL}/tirada-de-cartas-espanolas/${tipo}/${ciudad}` },
    openGraph: {
      title,
      description: tip.urgencia,
      url: `${SITE_URL}/tirada-de-cartas-espanolas/${tipo}/${ciudad}`,
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
    name: `Tirada de Cartas de ${tip.nombre} en ${loc.nombre}`,
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
        name: `¿Las cartas españolas sirven para consultas de ${tip.nombre.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tip.descripcion_seo} La baraja española lleva siglos respondiendo preguntas sobre el ${tip.nombre.toLowerCase()} con notable precisión.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Es gratis la tirada de cartas en ${loc.nombre}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Sí, completamente gratis y sin registro. Podés hacer todas las tiradas que quieras desde ${loc.nombre} o cualquier parte del mundo.`,
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
          {tip.icono} Baraja Española · {loc.nombre}, {loc.provincia}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
          Tirada de Cartas de {tip.nombre} en {loc.nombre}
        </h1>
        <p className="text-amber-700 max-w-2xl mx-auto text-lg">{tip.descripcion_seo}</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <TiradaEspanola />

        <section className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            Cartas de {tip.nombre.toLowerCase()} desde {loc.nombre}
          </h2>
          <p className="text-amber-800 mb-4">{loc.contexto_local}</p>
          <p className="text-amber-800 mb-4">{tip.urgencia}</p>
          <p className="text-amber-800">
            La tirada en cruz revela cinco aspectos de tu situación: el presente, el pasado que influye,
            el futuro próximo, el consejo de las cartas y el resultado probable. La inteligencia artificial
            interpreta cada combinación en función de tu pregunta sobre {tip.nombre.toLowerCase()},
            dando una lectura personalizada y honesta.
          </p>
        </section>

        <section className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              {
                q: `¿Las cartas españolas sirven para consultas de ${tip.nombre.toLowerCase()}?`,
                a: `${tip.descripcion_seo} La baraja española lleva siglos respondiendo preguntas sobre el ${tip.nombre.toLowerCase()} con notable precisión.`,
              },
              {
                q: `¿Es gratis la tirada de cartas en ${loc.nombre}?`,
                a: `Sí, completamente gratis y sin registro. Podés hacer todas las tiradas que quieras desde ${loc.nombre} o cualquier parte del mundo.`,
              },
              {
                q: '¿Qué diferencia hay entre la baraja española y el tarot?',
                a: 'La baraja española tiene 40 cartas divididas en oros, copas, espadas y bastos. El tarot clásico tiene 78 cartas con un simbolismo arquetípico más amplio. Ambos están disponibles en TiradaCruz.',
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
