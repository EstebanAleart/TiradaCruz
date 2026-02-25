import { Sparkles } from "lucide-react"

export default function InterpretacionPanel({ cargando, error, interpretacion }) {
  if (cargando) {
    return (
      <div className="mt-10 bg-white/90 rounded-2xl p-8 shadow-xl border border-amber-200 text-center">
        <div className="flex items-center justify-center gap-3 text-amber-700">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <p className="text-lg font-medium">La IA está leyendo tus cartas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-10 bg-red-50 rounded-2xl p-6 shadow border border-red-200">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )
  }

  if (!interpretacion) return null

  return (
    <div className="mt-10 bg-gradient-to-br from-amber-900 via-red-950 to-purple-950 rounded-2xl p-8 shadow-2xl border border-amber-700">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold text-amber-100">Tu Lectura</h2>
      </div>
      <div className="text-amber-100 leading-relaxed whitespace-pre-wrap text-base">
        {interpretacion}
      </div>
    </div>
  )
}
