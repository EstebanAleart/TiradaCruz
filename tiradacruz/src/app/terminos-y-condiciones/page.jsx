import { SITE_URL } from '@/lib/seo-utils'
import Footer from '@/components/landing/Footer'

export async function generateMetadata() {
  const title = 'Términos y Condiciones | TiradaCruz'
  const description = 'Términos y condiciones de uso de TiradaCruz, la plataforma argentina de tiradas de tarot y baraja española online.'
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/terminos-y-condiciones` },
    openGraph: { title, description, url: `${SITE_URL}/terminos-y-condiciones`, type: 'website', locale: 'es_AR', siteName: 'TiradaCruz' },
    twitter: { card: 'summary', title, description },
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Términos y Condiciones - TiradaCruz',
    url: `${SITE_URL}/terminos-y-condiciones`,
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  return (
    <div className="min-h-screen bg-[#050509]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="text-center py-8 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          &larr; TiradaCruz
        </a>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Términos y Condiciones</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">Última actualización: mayo 2025</p>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="text-slate-400 text-sm leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-white">1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar TiradaCruz (en adelante, "el Sitio"), accesible desde tiradadecartas.com.ar, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices el Sitio.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">2. Naturaleza del servicio</h2>
          <p>
            TiradaCruz es una plataforma de entretenimiento que ofrece tiradas de tarot y baraja española online con interpretación asistida por inteligencia artificial. El servicio tiene un carácter exclusivamente recreativo y lúdico.
          </p>
          <p>
            Las lecturas e interpretaciones generadas por el Sitio no constituyen, bajo ninguna circunstancia, asesoramiento profesional de ningún tipo, incluyendo pero no limitado a: asesoramiento médico, psicológico, legal, financiero o de cualquier otra índole profesional.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">3. Uso aceptable</h2>
          <p>
            Al usar el Sitio, te comprometés a:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilizar el servicio únicamente con fines de entretenimiento personal.</li>
            <li>No reproducir, distribuir ni modificar el contenido del Sitio sin autorización previa.</li>
            <li>No intentar acceder a áreas restringidas del Sitio ni interferir con su funcionamiento.</li>
            <li>No utilizar el servicio para tomar decisiones importantes de vida sin consultar a profesionales calificados.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6">4. Propiedad intelectual</h2>
          <p>
            Todo el contenido del Sitio, incluyendo textos, gráficos, logotipos, íconos, imágenes, código fuente, diseño y la selección y disposición de los mismos, es propiedad de TiradaCruz o de sus licenciantes y está protegido por las leyes argentinas e internacionales de propiedad intelectual.
          </p>
          <p>
            Las interpretaciones generadas por inteligencia artificial son contenido original creado en tiempo real y no pueden ser reproducidas masivamente ni comercializadas sin autorización expresa.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">5. Limitación de responsabilidad</h2>
          <p>
            TiradaCruz no se responsabiliza por:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Las decisiones que los usuarios tomen basándose en las lecturas proporcionadas por el Sitio.</li>
            <li>Interrupciones temporales del servicio por mantenimiento técnico o causas de fuerza mayor.</li>
            <li>La precisión o veracidad de las interpretaciones generadas por IA, las cuales son de naturaleza aleatoria y recreativa.</li>
            <li>El contenido de sitios web de terceros enlazados desde el Sitio.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6">6. Disponibilidad del servicio</h2>
          <p>
            TiradaCruz se esfuerza por mantener el Sitio disponible las 24 horas del día, los 7 días de la semana. Sin embargo, no garantizamos la disponibilidad ininterrumpida del servicio. Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del Sitio en cualquier momento y sin previo aviso.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">7. Modificaciones de los términos</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en el Sitio. El uso continuado del servicio después de cualquier modificación constituye la aceptación de los nuevos términos.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">8. Legislación aplicable y jurisdicción</h2>
          <p>
            Estos términos y condiciones se rigen por las leyes de la República Argentina. Cualquier controversia que surja en relación con el uso del Sitio será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando expresamente a cualquier otro fuero que pudiera corresponder.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">9. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con estos términos, podés contactarnos a través de <a href="https://www.pairprogramming.com.ar" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white transition-colors">pairprogramming.com.ar</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
