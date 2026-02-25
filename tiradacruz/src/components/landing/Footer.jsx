export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-200 text-center py-6 text-sm">
      <p>
        TiradaCruz &copy; {new Date().getFullYear()} · Tarot Online Gratis · Argentina
      </p>
      <p className="text-amber-400 mt-1 text-xs">
        Las lecturas son de carácter orientativo y no reemplazan el consejo profesional.
      </p>
    </footer>
  )
}
