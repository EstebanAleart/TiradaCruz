"use client"

import { useState, useEffect } from "react"
import { obtenerHistorial } from "@/lib/historial"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"

const MODO_LABEL = {
  espanolas: "Española",
  tarot_mayores: "Tarot Mayores",
  tarot_completo: "Tarot 78",
}

const MODO_STYLE = {
  espanolas: { background: "rgba(217,119,6,0.12)", color: "#fbbf24", border: "1px solid rgba(217,119,6,0.2)" },
  tarot_mayores: { background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" },
  tarot_completo: { background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" },
}

export default function HistorialPanel() {
  const [historial, setHistorial] = useState([])
  const [abierto, setAbierto] = useState(false)
  const [expandido, setExpandido] = useState(null)

  useEffect(() => { setHistorial(obtenerHistorial()) }, [])

  if (historial.length === 0) return null

  return (
    <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
      <button
        onClick={() => setAbierto((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:brightness-110"
        style={{ background: "#0c0c18" }}
      >
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Clock className="w-4 h-4 text-slate-600" />
          Mis tiradas recientes ({historial.length})
        </div>
        {abierto
          ? <ChevronUp className="w-4 h-4 text-slate-600" />
          : <ChevronDown className="w-4 h-4 text-slate-600" />
        }
      </button>

      {abierto && (
        <div style={{ background: "#080810" }}>
          {historial.map((t, idx) => (
            <div
              key={t.id}
              className="px-5 py-4"
              style={{ borderTop: idx === 0 ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={MODO_STYLE[t.modo] || { background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}
                  >
                    {MODO_LABEL[t.modo] || t.modo}
                  </span>
                  <span className="text-xs text-slate-600">{t.fecha}</span>
                </div>
                <button
                  onClick={() => setExpandido(expandido === t.id ? null : t.id)}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {expandido === t.id ? "Ver menos" : "Ver cartas"}
                </button>
              </div>

              {t.pregunta && (
                <p className="mt-2 text-xs text-slate-500 italic">"{t.pregunta}"</p>
              )}

              {expandido === t.id && (
                <div className="mt-3 space-y-1">
                  {t.cartas?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-amber-700/60">•</span>
                      <span className="text-slate-600 w-20 shrink-0">{c.posicion}:</span>
                      <span className="text-slate-500">{c.nombreCarta}</span>
                      {c.isReversed && <span className="text-rose-700/60">(inv.)</span>}
                    </div>
                  ))}
                </div>
              )}

              {t.resumen && (
                <p className="mt-2 text-xs text-slate-700 leading-relaxed line-clamp-3">
                  {t.resumen}{t.resumen.length >= 180 ? "..." : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
