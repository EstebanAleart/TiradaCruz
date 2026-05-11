import { SITE_URL } from '@/lib/seo-utils'
import Footer from '@/components/landing/Footer'

export async function generateMetadata() {
  const title = 'Sobre Nosotros | TiradaCruz'
  const description = 'Conocé quiénes somos y la misión detrás de TiradaCruz, la plataforma argentina de tarot y baraja española online con interpretación por IA.'
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/sobre-nosotros` },
    openGraph: { title, description, url: `${SITE_URL}/sobre-nosotros`, type: 'website', locale: 'es_AR', siteName: 'TiradaCruz' },
    twitter: { card: 'summary', title, description },
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre Nosotros - TiradaCruz',
    url: `${SITE_URL}/sobre-nosotros`,
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  return (
    <div className="min-h-screen bg-[#050509]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="text-center py-8 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          &larr; TiradaCruz
        </a>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Sobre Nosotros</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">Quiénes somos y por qué creamos TiradaCruz</p>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="text-slate-400 text-sm leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-white">Nuestra misión</h2>
          <p>
            TiradaCruz nació con una idea simple: acercar la lectura de cartas a cualquier persona, en cualquier momento, desde cualquier lugar de Argentina y el mundo. Creemos que el tarot y la baraja española son herramientas milenarias de autoconocimiento que merecen ser accesibles para todos, sin barreras de costo ni de distancia.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">Qué ofrecemos</h2>
          <p>
            Nuestra plataforma combina la tradición de la cartomancia con tecnología de inteligencia artificial. Podés realizar tiradas de tarot (con Arcanos Mayores o el mazo completo de 78 cartas) y tiradas de baraja española, siguiendo el ritual completo: formular tu pregunta, mezclar el mazo, cortarlo en tres montones y revelar las cartas en la icónica disposición en cruz.
          </p>
          <p>
            Cada tirada puede ser interpretada por nuestra IA, que analiza la combinación de cartas, sus posiciones y orientaciones (al derecho o invertidas) para ofrecerte una lectura personalizada. Además, podés seguir conversando con la lectora virtual para profundizar en los aspectos que más te interesen.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">Raíces argentinas</h2>
          <p>
            TiradaCruz es un proyecto 100% argentino, desarrollado con cariño desde Buenos Aires. Nuestro contenido está escrito en español rioplatense y pensado para la cultura y las inquietudes de quienes viven en este rincón del mundo. Desde Ushuaia hasta La Quiaca, pasando por Córdoba, Rosario, Mendoza y cada ciudad del país, queremos que sientas que esta herramienta fue hecha para vos.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">Compromiso con el entretenimiento responsable</h2>
          <p>
            Es importante aclarar que TiradaCruz es una plataforma de entretenimiento. Las lecturas de cartas, ya sean de tarot o baraja española, no constituyen asesoramiento profesional de ningún tipo: ni médico, ni legal, ni financiero, ni psicológico. Disfrutá de la experiencia como lo que es: un espacio lúdico para explorar tu intuición y reflexionar sobre los temas que te importan.
          </p>
          <p>
            Si tenés consultas profesionales sobre salud, finanzas o cuestiones legales, te recomendamos siempre acudir a un profesional matriculado en la materia.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">Tecnología</h2>
          <p>
            TiradaCruz está potenciado por <a href="https://www.pairprogramming.com.ar" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white transition-colors">PairProgramming</a>, un estudio de desarrollo web argentino especializado en soluciones digitales modernas. Utilizamos inteligencia artificial de última generación para ofrecer interpretaciones de calidad, manteniendo siempre el respeto por la tradición esotérica y el bienestar de nuestros usuarios.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
