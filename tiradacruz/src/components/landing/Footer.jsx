export default function Footer() {
  return (
    <footer className="py-8 px-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <p className="text-slate-600 text-xs">
        TiradaCruz &copy; {new Date().getFullYear()} · Tarot Online Gratis · Argentina
      </p>
      <p className="text-slate-700 text-xs mt-1">
        Las lecturas son orientativas y no reemplazan el consejo profesional.
      </p>
    </footer>
  )
}
