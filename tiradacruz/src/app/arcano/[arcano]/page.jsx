import { notFound } from 'next/navigation'
import arcanos from '@/data/arcanos.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaTarot from '@/components/tarot/TiradaTarot'
import Footer from '@/components/landing/Footer'

export async function generateStaticParams() {
  return arcanos.map((a) => ({ arcano: a.id }))
}

export async function generateMetadata({ params }) {
  const { arcano } = await params
  const arc = arcanos.find((a) => a.id === arcano)
  if (!arc) return {}

  const title = `${arc.nombre} — Significado en el Tarot | TiradaCruz`
  const description = `${arc.significado_seo} Consultá el ${arc.nombre} en una tirada online gratis con interpretación por IA. TiradaCruz Argentina.`

  return {
    title,
    description,
    keywords: [arc.nombre, ...arc.palabras_clave, 'arcanos mayores', 'significado tarot', 'tarot gratis argentina'],
    alternates: { canonical: `${SITE_URL}/arcano/${arcano}` },
    openGraph: {
      title,
      description: arc.significado_corto,
      url: `${SITE_URL}/arcano/${arcano}`,
      type: 'website',
      locale: 'es_AR',
      siteName: 'TiradaCruz',
    },
    twitter: { card: 'summary_large_image', title, description: arc.significado_corto },
  }
}

export default async function Page({ params }) {
  const { arcano } = await params
  const arc = arcanos.find((a) => a.id === arcano)
  if (!arc) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${arc.nombre} — Significado en el Tarot`,
    description: arc.significado_seo,
    inLanguage: 'es-AR',
    keywords: arc.palabras_clave.join(', '),
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Qué significa ${arc.nombre} en el tarot?`,
        acceptedAnswer: { '@type': 'Answer', text: arc.significado_seo },
      },
      {
        '@type': 'Question',
        name: `¿Cuáles son las palabras clave de ${arc.nombre}?`,
        acceptedAnswer: { '@type': 'Answer', text: arc.palabras_clave.join(', ') + '.' },
      },
    ],
  }

  const arcanosPrev = arcanos.filter((a) => a.numero < arc.numero).slice(-2)
  const arcanosNext = arcanos.filter((a) => a.numero > arc.numero).slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="text-center py-8 px-4 border-b border-amber-200/50">
        <a href="/" className="text-sm text-amber-600 hover:text-amber-800 mb-4 inline-block">
          ← TiradaCruz
        </a>
        <p className="text-sm text-amber-700 mb-2 font-medium">
          🔮 Arcano Mayor N° {arc.numero}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">{arc.nombre}</h1>
        <p className="text-amber-700 max-w-2xl mx-auto text-lg">{arc.significado_corto}</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Significado */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            Significado de {arc.nombre}
          </h2>
          <p className="text-amber-800 mb-4">{arc.significado_seo}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {arc.palabras_clave.map((kw) => (
              <span key={kw} className="text-sm px-3 py-1 bg-amber-100 rounded-full text-amber-800 border border-amber-200">
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* App */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-amber-900 mb-2 text-center">
            Hacé una tirada completa de tarot
          </h2>
          <p className="text-center text-amber-700 mb-6 text-sm">
            {arc.nombre} puede aparecer en tu tirada. Consultá lo que viene.
          </p>
          <TiradaTarot />
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              {
                q: `¿Qué significa ${arc.nombre} en el tarot?`,
                a: arc.significado_seo,
              },
              {
                q: `¿${arc.nombre} es un arcano positivo o negativo?`,
                a: `En el tarot, ${arc.nombre} no es positivo ni negativo de forma absoluta. Su mensaje depende de la posición en la tirada y las cartas que la rodean. Las palabras clave son: ${arc.palabras_clave.join(', ')}.`,
              },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white/60 rounded-lg p-4 cursor-pointer">
                <summary className="font-medium text-amber-900">{q}</summary>
                <p className="mt-2 text-amber-800 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Navegación entre arcanos */}
        {(arcanosPrev.length > 0 || arcanosNext.length > 0) && (
          <nav className="mt-10 flex justify-between items-center max-w-xl mx-auto">
            <div className="flex gap-2">
              {arcanosPrev.map((a) => (
                <a key={a.id} href={`/arcano/${a.id}`} className="text-sm px-3 py-1.5 bg-white/60 hover:bg-white/90 rounded-full text-amber-800 border border-amber-200">
                  ← {a.nombre}
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              {arcanosNext.map((a) => (
                <a key={a.id} href={`/arcano/${a.id}`} className="text-sm px-3 py-1.5 bg-white/60 hover:bg-white/90 rounded-full text-amber-800 border border-amber-200">
                  {a.nombre} →
                </a>
              ))}
            </div>
          </nav>
        )}

        <p className="text-xs text-amber-500 mt-10 text-center max-w-xl mx-auto">
          Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales médicos, legales ni financieros.
        </p>
      </main>

      <Footer />
    </div>
  )
}
