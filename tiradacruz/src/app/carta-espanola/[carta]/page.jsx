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

  const faqs = [
    {
      q: `¿Qué significa el ${c.nombre} en la baraja española?`,
      a: c.significado_general || c.significado_seo,
    },
    {
      q: `¿Qué palo es el ${c.nombre}?`,
      a: `El ${c.nombre} pertenece al palo de ${c.palo_nombre}. Las palabras clave de esta carta son: ${c.palabras_clave.join(', ')}.`,
    },
  ]

  if (c.significado_amor) {
    faqs.push({
      q: `¿Qué dice el ${c.nombre} sobre el amor?`,
      a: c.significado_amor,
    })
  }
  if (c.significado_trabajo) {
    faqs.push({
      q: `¿Qué indica el ${c.nombre} en el trabajo?`,
      a: c.significado_trabajo,
    })
  }
  if (c.significado_invertida) {
    faqs.push({
      q: `¿Qué significa el ${c.nombre} invertido?`,
      a: c.significado_invertida,
    })
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const cartasMismoPalo = cartas.filter((x) => x.palo === c.palo && x.id !== c.id).slice(0, 4)

  const sectionStyle = { border: '1px solid rgba(255,255,255,0.06)', background: '#0c0c18' }

  return (
    <div className="min-h-screen bg-[#050509]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <VisitaTracker data={{ ruta: `/carta-espanola/${carta}`, modo: 'espanola', carta_id: carta }} />

      <header className="text-center py-8 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          &larr; TiradaCruz
        </a>
        <p className="text-sm font-medium mb-2" style={{ color: "#fbbf24" }}>
          Baraja Española · Palo de {c.palo_nombre}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{c.nombre}</h1>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {c.palabras_clave.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: "rgba(217,119,6,0.12)", color: "#fbbf24", border: "1px solid rgba(217,119,6,0.2)" }}
            >
              {kw}
            </span>
          ))}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-16">
        {/* Significado general */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            ¿Qué significa el {c.nombre}?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-2">{c.significado_seo}</p>
          {c.significado_general && c.significado_general !== c.significado_seo && (
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{c.significado_general}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {c.palabras_clave.map((kw) => (
              <span
                key={kw}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(217,119,6,0.12)", color: "#fbbf24", border: "1px solid rgba(217,119,6,0.2)" }}
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* Rich content sections */}
        <div className="mt-8 space-y-4">
          {c.significado_amor && (
            <section className="rounded-xl p-5" style={sectionStyle}>
              <h2 className="text-base font-semibold text-white mb-2">{c.nombre} en el Amor</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{c.significado_amor}</p>
            </section>
          )}

          {c.significado_trabajo && (
            <section className="rounded-xl p-5" style={sectionStyle}>
              <h2 className="text-base font-semibold text-white mb-2">{c.nombre} en el Trabajo</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{c.significado_trabajo}</p>
            </section>
          )}

          {c.significado_dinero && (
            <section className="rounded-xl p-5" style={sectionStyle}>
              <h2 className="text-base font-semibold text-white mb-2">{c.nombre} y el Dinero</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{c.significado_dinero}</p>
            </section>
          )}

          {c.significado_salud && (
            <section className="rounded-xl p-5" style={sectionStyle}>
              <h2 className="text-base font-semibold text-white mb-2">{c.nombre} y la Salud</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{c.significado_salud}</p>
            </section>
          )}

          {c.significado_invertida && (
            <section className="rounded-xl p-5" style={sectionStyle}>
              <h2 className="text-base font-semibold text-white mb-2">{c.nombre} Invertida</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{c.significado_invertida}</p>
            </section>
          )}

          {c.consejo && (
            <section className="rounded-xl p-5" style={{ border: '1px solid rgba(217,119,6,0.15)', background: 'rgba(217,119,6,0.05)' }}>
              <h2 className="text-base font-semibold mb-2" style={{ color: '#fbbf24' }}>Consejo</h2>
              <p className="text-slate-300 text-sm leading-relaxed italic">{c.consejo}</p>
            </section>
          )}
        </div>

        {/* Tirada interactiva */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-white mb-1 text-center">
            Hacé tu tirada de cartas ahora
          </h2>
          <p className="text-center text-slate-500 mb-6 text-sm">
            El {c.nombre} puede aparecer en tu tirada. Consultá lo que te dicen las cartas.
          </p>
          <TiradaEspanola />
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-white mb-3">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="rounded-xl overflow-hidden cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0c0c18" }}
              >
                <summary className="px-5 py-4 font-medium text-slate-300 text-sm list-none flex justify-between items-center gap-4">
                  {q}
                  <span className="text-slate-600 shrink-0">▾</span>
                </summary>
                <p className="px-5 pb-4 text-slate-500 text-sm leading-relaxed" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="block pt-3">{a}</span>
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related cards */}
        {cartasMismoPalo.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-500 mb-3">
              Otras cartas de {c.palo_nombre}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cartasMismoPalo.map((x) => (
                <a
                  key={x.id}
                  href={`/carta-espanola/${x.id}`}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {x.nombre}
                </a>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-slate-700 mt-10 text-center">
          Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales médicos, legales ni financieros.
        </p>
      </main>

      <Footer />
    </div>
  )
}
