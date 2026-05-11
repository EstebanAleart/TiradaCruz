import { notFound } from 'next/navigation'
import arcanos from '@/data/arcanos.json'
import tarotData from '@/lib/tarot-data.json'
import { SITE_URL } from '@/lib/seo-utils'
import TiradaTarot from '@/components/tarot/TiradaTarot'
import Footer from '@/components/landing/Footer'
import VisitaTracker from '@/components/VisitaTracker'

const tarotRichMap = Object.fromEntries(
  tarotData.filter((c) => c.type === 'mayor').map((c) => [c.name_short, c])
)

function getRichData(arc) {
  const key = arc.nombre_short === 'ar22' ? 'ar00' : arc.nombre_short
  return tarotRichMap[key] || null
}

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

  const rich = getRichData(arc)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${arc.nombre} — Significado en el Tarot`,
    description: arc.significado_seo,
    inLanguage: 'es-AR',
    keywords: arc.palabras_clave.join(', '),
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  const faqs = [
    {
      q: `¿Qué significa ${arc.nombre} en el tarot?`,
      a: arc.significado_seo,
    },
    {
      q: `¿${arc.nombre} es un arcano positivo o negativo?`,
      a: `En el tarot, ${arc.nombre} no es positivo ni negativo de forma absoluta. Su mensaje depende de la posición en la tirada y las cartas que la rodean. Las palabras clave son: ${arc.palabras_clave.join(', ')}.`,
    },
  ]

  if (rich?.amor) {
    faqs.push({
      q: `¿Qué dice ${arc.nombre} sobre el amor?`,
      a: rich.amor.slice(0, 200) + (rich.amor.length > 200 ? '...' : ''),
    })
  }
  if (rich?.trabajo) {
    faqs.push({
      q: `¿Qué indica ${arc.nombre} en el trabajo?`,
      a: rich.trabajo.slice(0, 200) + (rich.trabajo.length > 200 ? '...' : ''),
    })
  }
  if (rich?.salud) {
    faqs.push({
      q: `¿Qué dice ${arc.nombre} sobre la salud?`,
      a: rich.salud.slice(0, 200) + (rich.salud.length > 200 ? '...' : ''),
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

  const arcanosPrev = arcanos.filter((a) => a.numero < arc.numero).slice(-2)
  const arcanosNext = arcanos.filter((a) => a.numero > arc.numero).slice(0, 2)

  const sectionStyle = { border: '1px solid rgba(255,255,255,0.06)', background: '#0c0c18' }

  return (
    <div className="min-h-screen bg-[#050509]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <VisitaTracker data={{ ruta: `/arcano/${arcano}`, modo: 'tarot', arcano_id: arcano }} />

      <header className="text-center py-8 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          &larr; TiradaCruz
        </a>
        <p className="text-sm font-medium mb-2" style={{ color: "#a78bfa" }}>
          Arcano Mayor N° {arc.numero}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{arc.nombre}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">{arc.significado_corto}</p>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-16">
        {/* Significado general */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-3">
            Significado de {arc.nombre}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{arc.significado_seo}</p>
          <div className="flex flex-wrap gap-2">
            {arc.palabras_clave.map((kw) => (
              <span
                key={kw}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* Rich content from tarot-data.json */}
        {rich && (
          <div className="mt-8 space-y-4">
            {rich.meaning_up && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">Significado al Derecho</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.meaning_up}</p>
              </section>
            )}

            {rich.meaning_rev && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">Significado Invertido</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.meaning_rev}</p>
              </section>
            )}

            {rich.amor && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">{arc.nombre} en el Amor</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.amor}</p>
              </section>
            )}

            {rich.trabajo && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">{arc.nombre} en el Trabajo</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.trabajo}</p>
              </section>
            )}

            {rich.finanzas && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">{arc.nombre} y las Finanzas</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.finanzas}</p>
              </section>
            )}

            {rich.salud && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">{arc.nombre} y la Salud</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.salud}</p>
              </section>
            )}

            {rich.espiritualidad && (
              <section className="rounded-xl p-5" style={sectionStyle}>
                <h2 className="text-base font-semibold text-white mb-2">{arc.nombre} y la Espiritualidad</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{rich.espiritualidad}</p>
              </section>
            )}
          </div>
        )}

        {/* Tirada interactiva */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-white mb-1 text-center">
            Hacé una tirada completa de tarot
          </h2>
          <p className="text-center text-slate-500 mb-6 text-sm">
            {arc.nombre} puede aparecer en tu tirada. Consultá lo que viene.
          </p>
          <TiradaTarot />
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-white mb-3">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="rounded-xl overflow-hidden cursor-pointer group"
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

        {/* Nav prev/next */}
        {(arcanosPrev.length > 0 || arcanosNext.length > 0) && (
          <nav className="mt-8 flex justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              {arcanosPrev.map((a) => (
                <a
                  key={a.id}
                  href={`/arcano/${a.id}`}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  &larr; {a.nombre}
                </a>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {arcanosNext.map((a) => (
                <a
                  key={a.id}
                  href={`/arcano/${a.id}`}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {a.nombre} &rarr;
                </a>
              ))}
            </div>
          </nav>
        )}

        <p className="text-xs text-slate-700 mt-10 text-center">
          Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales médicos, legales ni financieros.
        </p>
      </main>

      <Footer />
    </div>
  )
}
