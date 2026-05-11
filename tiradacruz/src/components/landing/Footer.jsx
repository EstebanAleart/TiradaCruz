export default function Footer() {
  return (
    <footer className="py-8 px-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
        <a href="/sobre-nosotros" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Sobre nosotros</a>
        <a href="/contacto" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Contacto</a>
        <a href="/politica-de-privacidad" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacidad</a>
        <a href="/terminos-y-condiciones" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Términos</a>
        <a href="/aviso-legal" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Aviso legal</a>
      </nav>
      <p className="text-slate-600 text-xs">
        TiradaCruz &copy; {new Date().getFullYear()} · Tarot Online Gratis · Argentina
      </p>
      <p className="text-slate-700 text-xs mt-1">
        Las lecturas son orientativas y no reemplazan el consejo profesional.
      </p>
      <p className="text-slate-700 text-xs mt-2">
        Potenciado por{' '}
        <a href="https://www.pairprogramming.com.ar" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors underline">
          PairProgramming
        </a>
      </p>
    </footer>
  )
}
