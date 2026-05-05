import { notFound } from 'next/navigation'
import cartas from '@/data/cartas-espanolas.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaEspanola from '@/components/espanolas/TiradaEspanola'
import Footer from '@/components/landing/Footer'
import VisitaTracker from '@/components/VisitaTracker'

export async function generateStaticParams() {
  return cartas.map((c) => ({ carta: c.id }))
}

export async function generateMetadata({ params }) {
  const { carta } = await params
  const c = cartas.find((x) => x.id === carta)
  if (!c) return {}

  const title = `${c.nombre} — Significado en la Baraja Española | TiradaCruz`
  const description = `${c.significado_seo} Consultá las cartas online gratis con interpretación por IA. TiradaCruz Argentina.`

  return {
    title,
    description,
    keywords: [c.nombre, c.palo_nombre, ...c.palabras_clave, 'baraja española significado', 'cartas españolas online', 'tarot gratis argentina'],
    alternates: { canonical: `${SITE_URL}/carta-espanola/${carta}` },
    openGraph: {
      title,
      description: c.significado_seo,
      url: `${SITE_URL}/carta-espanola/${carta}`,
      type: 'website',
      locale: 'es_AR',
      siteName: 'TiradaCruz',
    },
    twitter: { card: 'summary_large_image', title, description: c.significado_seo },
  }
}

export default async function Page({ params }) {
  const { carta } = await params
  const c = cartas.find((x) => x.id === carta)
  if (!c) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${c.nombre} — Significado en la Baraja Española`,
    description: c.significado_seo,
    inLanguage: 'es-AR',
    keywords: c.palabras_clave.join(', '),
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Qué significa el ${c.nombre} en la baraja española?`,
        acceptedAnswer: { '@type': 'Answer', text: c.significado_seo },
      },
      {
        '@type': 'Question',
        name: `¿Qué palo es el ${c.nombre}?`,
        acceptedAnswer: { '@type': 'Answer', text: `El ${c.nombre} pertenece al palo de ${c.palo_nombre}. Las palabras clave de esta carta son: ${c.palabras_clave.join(', ')}.` },
      },
    ],
  }

  const cartasMismoPalo = cartas.filter((x) => x.palo === c.palo && x.id !== c.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <VisitaTracker data={{ ruta: `/carta-espanola/${carta}`, modo: 'espanola', carta_id: carta }} />

      <header className="text-center py-8 px-4 border-b border-amber-200/50">
        <a href="/" className="text-sm text-amber-600 hover:text-amber-800 mb-4 inline-block">
          ← TiradaCruz
        </a>
        <p className="text-sm text-amber-700 mb-2 font-medium">
          🃏 Baraja Española · Palo de {c.palo_nombre}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">{c.nombre}</h1>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {c.palabras_clave.slice(0, 3).map((kw) => (
            <span key={kw} className="text-sm px-3 py-1 bg-amber-100 rounded-full text-amber-800 border border-amber-200">
              {kw}
            </span>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Significado */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            ¿Qué significa el {c.nombre}?
          </h2>
          <p className="text-amber-800 mb-4">{c.significado_seo}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {c.palabras_clave.map((kw) => (
              <span key={kw} className="text-sm px-3 py-1 bg-amber-100 rounded-full text-amber-800 border border-amber-200">
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* App */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-amber-900 mb-2 text-center">
            Hacé tu tirada de cartas ahora
          </h2>
          <p className="text-center text-amber-700 mb-6 text-sm">
            El {c.nombre} puede aparecer en tu tirada. Consultá lo que te dicen las cartas.
          </p>
          <TiradaEspanola />
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              {
                q: `¿Qué significa el ${c.nombre} en la baraja española?`,
                a: c.significado_seo,
              },
              {
                q: `¿El ${c.nombre} es una carta positiva?`,
                a: `El significado del ${c.nombre} depende del contexto de la tirada. En general está asociado con: ${c.palabras_clave.join(', ')}.`,
              },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white/60 rounded-lg p-4 cursor-pointer">
                <summary className="font-medium text-amber-900">{q}</summary>
                <p className="mt-2 text-amber-800 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Otras cartas del mismo palo */}
        {cartasMismoPalo.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">
              Otras cartas de {c.palo_nombre}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cartasMismoPalo.map((x) => (
                <a
                  key={x.id}
                  href={`/carta-espanola/${x.id}`}
                  className="text-sm px-3 py-1.5 bg-white/60 hover:bg-white/90 rounded-full text-amber-800 border border-amber-200 transition-colors"
                >
                  {x.nombre}
                </a>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-amber-500 mt-10 text-center max-w-xl mx-auto">
          Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales médicos, legales ni financieros.
        </p>
      </main>

      <Footer />
    </div>
  )
}
