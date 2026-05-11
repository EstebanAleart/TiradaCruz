import { SITE_URL } from '@/lib/seo-utils'
import Footer from '@/components/landing/Footer'

export async function generateMetadata() {
  const title = 'Política de Privacidad | TiradaCruz'
  const description = 'Conocé cómo TiradaCruz recopila, usa y protege tus datos personales. Política de privacidad conforme a la legislación argentina.'
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/politica-de-privacidad` },
    openGraph: { title, description, url: `${SITE_URL}/politica-de-privacidad`, type: 'website', locale: 'es_AR', siteName: 'TiradaCruz' },
    twitter: { card: 'summary', title, description },
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Política de Privacidad - TiradaCruz',
    url: `${SITE_URL}/politica-de-privacidad`,
    publisher: { '@type': 'Organization', name: 'TiradaCruz', url: SITE_URL },
  }

  return (
    <div className="min-h-screen bg-[#050509]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="text-center py-8 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <a href="/" className="text-sm text-slate-600 hover:text-slate-400 mb-4 inline-block transition-colors">
          &larr; TiradaCruz
        </a>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Política de Privacidad</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">Última actualización: mayo 2025</p>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="text-slate-400 text-sm leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-white">1. Información que recopilamos</h2>
          <p>
            TiradaCruz (en adelante, "el Sitio"), accesible desde tiradadecartas.com.ar, recopila información limitada con el objetivo de mejorar la experiencia del usuario y analizar el uso de la plataforma. Los datos que podemos recopilar incluyen:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos de navegación: páginas visitadas, tipo de dispositivo, navegador utilizado, ciudad aproximada (sin identificación personal).</li>
            <li>Datos de interacción: acciones realizadas en el sitio (mezclar cartas, realizar tiradas, interpretar lecturas).</li>
            <li>Cookies técnicas: necesarias para el funcionamiento del sitio y la sesión de administración.</li>
          </ul>
          <p>
            No recopilamos nombres, direcciones de correo electrónico, números de teléfono ni ningún otro dato de identificación personal directa. Las preguntas que formulás durante las tiradas se procesan en tiempo real y no se almacenan de forma asociada a tu identidad.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">2. Uso de la información</h2>
          <p>
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Generar estadísticas anónimas de uso del sitio.</li>
            <li>Mejorar el contenido y la funcionalidad de la plataforma.</li>
            <li>Garantizar el correcto funcionamiento técnico del servicio.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6">3. Servicios de terceros</h2>
          <p>
            El Sitio utiliza los siguientes servicios de terceros que pueden recopilar información según sus propias políticas de privacidad:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google AdSense:</strong> servicio de publicidad de Google LLC que puede utilizar cookies para mostrar anuncios personalizados según tu historial de navegación. Podés gestionar tus preferencias de anuncios en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white transition-colors">adssettings.google.com</a>.</li>
            <li><strong>Supabase:</strong> servicio de base de datos utilizado para almacenar estadísticas anónimas de visitas.</li>
            <li><strong>Vercel:</strong> plataforma de hosting que puede recopilar datos técnicos de acceso (dirección IP, encabezados HTTP).</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-6">4. Cookies</h2>
          <p>
            El Sitio utiliza cookies técnicas necesarias para su funcionamiento. Las cookies de terceros (como las de Google AdSense) se rigen por las políticas de privacidad de cada proveedor. Podés configurar tu navegador para bloquear o eliminar cookies, aunque esto podría afectar la funcionalidad del sitio.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">5. Protección de datos personales</h2>
          <p>
            TiradaCruz cumple con la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y su normativa complementaria. Dado que no recopilamos datos de identificación personal directa, el riesgo para tu privacidad es mínimo. No obstante, tomamos medidas técnicas razonables para proteger la información almacenada.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">6. Derechos del usuario</h2>
          <p>
            En virtud de la legislación vigente, tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales. Para ejercer estos derechos o realizar cualquier consulta sobre privacidad, podés contactarnos a través de <a href="https://www.pairprogramming.com.ar" target="_blank" rel="noopener noreferrer" className="text-slate-300 underline hover:text-white transition-colors">pairprogramming.com.ar</a>.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">7. Retención de datos</h2>
          <p>
            Los datos de navegación y estadísticas se conservan por un período máximo de 12 meses, tras el cual son eliminados automáticamente. Las cookies de sesión se eliminan al cerrar el navegador o tras su período de expiración.
          </p>

          <h2 className="text-lg font-semibold text-white mt-6">8. Cambios en esta política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta misma página con la fecha de última actualización. Te recomendamos revisarla periódicamente.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
