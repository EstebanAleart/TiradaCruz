import { SITE_URL } from '@/lib/seo-utils'
import Footer from '@/components/landing/Footer'

export async function generateMetadata() {
  const title = 'Aviso Legal | TiradaCruz'
  const description = 'Aviso legal de TiradaCruz. Información sobre el titular del sitio, propiedad intelectual y jurisdicción aplicable.'
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/aviso-legal` },
    openGraph: { title, description, url: `${SITE_URL}/aviso-legal`, type: 'website', locale: 'es_AR', siteName: 'TiradaCruz' },
    twitter: { card: 'summary', title, description },
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Aviso Legal - TiradaCruz',
    url: `${SITE_URL}/aviso-legal`,
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  return (
    <div className="min-h-screen bg-[#050509]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="text-center py-8 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          &larr; TiradaCruz
        </a>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Aviso Legal</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">Información legal sobre el sitio</p>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="text-slate-400 text-sm leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-white">1. Identificación del sitio</h2>
          <p>
            El presente sitio web, TiradaCruz, es accesible a través del dominio tiradadecartas.com.ar. Se trata de una plataforma digital de entretenimiento dedicada a la lectura de cartas de tarot y baraja española con asistencia de inteligencia artificial.
          </p>
          <p>
            El desarrollo y mantenimiento técnico del Sitio es realizado por <a href="https://www.pairprogramming.com.ar" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white transition-colors">PairProgramming</a>, estudio de desarrollo web con sede en la República Argentina.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">2. Objeto del sitio</h2>
          <p>
            TiradaCruz tiene como único propósito ofrecer un servicio de entretenimiento basado en la cartomancia digital. Las tiradas, lecturas e interpretaciones disponibles en el Sitio son generadas con fines recreativos y no pretenden sustituir el consejo o la opinión de profesionales en ninguna disciplina.
          </p>
          <p>
            El uso del Sitio no establece ningún tipo de relación profesional, comercial o de asesoramiento entre TiradaCruz y el usuario. Cada persona es responsable del uso que haga de la información proporcionada por la plataforma.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">3. Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del Sitio, incluyendo pero no limitado a textos, diseños, gráficos, logotipos, código fuente, estructura de navegación, bases de datos y cualquier otro elemento susceptible de protección, son propiedad de TiradaCruz o de sus licenciantes y se encuentran protegidos por la legislación argentina sobre propiedad intelectual (Ley N° 11.723) y las normas internacionales aplicables.
          </p>
          <p>
            Queda prohibida la reproducción total o parcial del contenido del Sitio sin autorización previa y por escrito, excepto en los casos expresamente permitidos por la ley.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">4. Exclusión de garantías y responsabilidad</h2>
          <p>
            TiradaCruz no garantiza la disponibilidad continua e ininterrumpida del Sitio, ni la ausencia de errores en sus contenidos. El Sitio se proporciona "tal cual" y "según disponibilidad".
          </p>
          <p>
            En la máxima medida permitida por la ley, TiradaCruz excluye toda responsabilidad por daños de cualquier naturaleza que puedan deberse a la falta de disponibilidad, continuidad o calidad del funcionamiento del Sitio y de sus contenidos; al incumplimiento de la expectativa de utilidad que los usuarios hubieren podido atribuir al Sitio y a sus contenidos.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">5. Enlaces a terceros</h2>
          <p>
            El Sitio puede contener enlaces a sitios web de terceros. TiradaCruz no se responsabiliza del contenido, las políticas de privacidad ni las prácticas de dichos sitios. El acceso a sitios enlazados se realiza bajo la exclusiva responsabilidad del usuario.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">6. Legislación aplicable</h2>
          <p>
            El presente aviso legal se rige íntegramente por la legislación de la República Argentina. Para la resolución de cualquier controversia relacionada con el uso del Sitio, las partes se someten a la jurisdicción de los Juzgados y Tribunales de la Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">7. Contacto</h2>
          <p>
            Para cualquier cuestión legal relacionada con el Sitio, podés contactarnos a través de <a href="https://www.pairprogramming.com.ar" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white transition-colors">pairprogramming.com.ar</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
