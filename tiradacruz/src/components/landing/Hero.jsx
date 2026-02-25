export default function Hero() {
  return (
    <header className="bg-gradient-to-br from-amber-900 via-red-900 to-purple-950 text-white py-12 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest mb-3">
          Tarot Online Gratis · Argentina · Rosario
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Tirada de Cartas Españolas en Cruz
        </h1>
        <p className="text-amber-100 text-lg mb-6">
          Mezclá, cortá y revelá tus cartas. Recibí tu interpretación personalizada
          con Inteligencia Artificial, al instante y sin costo. El mejor tarot online
          de Argentina.
        </p>
        <div className="flex justify-center gap-3 flex-wrap text-sm">
          <span className="bg-amber-800/50 border border-amber-600 rounded-full px-4 py-1">
            ✦ 100% Gratis
          </span>
          <span className="bg-amber-800/50 border border-amber-600 rounded-full px-4 py-1">
            ✦ Sin registro
          </span>
          <span className="bg-amber-800/50 border border-amber-600 rounded-full px-4 py-1">
            ✦ IA en español argentino
          </span>
        </div>
      </div>
    </header>
  )
}
