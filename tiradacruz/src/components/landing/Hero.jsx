export default function Hero() {
  return (
    <header
      className="relative overflow-hidden py-14 px-4 text-center"
      style={{ background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(180,83,9,0.18) 0%, transparent 65%), #050509" }}
    >
      <div className="max-w-lg mx-auto relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: "rgba(251,191,36,0.55)" }}>
          Tarot Online Gratis · Argentina
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Tirada de Cartas<br />en Cruz con IA
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Mezclá, cortá y revelá tus cartas. Interpretación personalizada con IA, al instante y sin costo.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {["100% Gratis", "Sin registro", "IA en español"].map((b) => (
            <span
              key={b}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.22)", color: "#fbbf24" }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
