"use client"

import { useState, useEffect } from "react"
import { obtenerHistorial } from "@/lib/historial"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"

const MODO_LABEL = {
  espanolas: "Baraja Española",
  tarot_mayores: "Tarot · Arcanos Mayores",
  tarot_completo: "Tarot · 78 Cartas",
}

const MODO_COLOR = {
  espanolas: "bg-amber-100 text-amber-800",
  tarot_mayores: "bg-purple-100 text-purple-800",
  tarot_completo: "bg-indigo-100 text-indigo-800",
}

export default function HistorialPanel() {
  const [historial, setHistorial] = useState([])
  const [abierto, setAbierto] = useState(false)
  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    setHistorial(obtenerHistorial())
  }, [])

  if (historial.length === 0) return null

  return (
    <div className="mt-10 mb-4 border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setAbierto((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 bg-amber-50 hover:bg-amber-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-amber-800 font-medium">
          <Clock className="w-4 h-4 text-amber-500" />
          Mis tiradas recientes ({historial.length})
        </div>
        {abierto ? (
          <ChevronUp className="w-4 h-4 text-amber-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-amber-500" />
        )}
      </button>

      {abierto && (
        <div className="divide-y divide-amber-100 bg-white">
          {historial.map((t) => (
            <div key={t.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${MODO_COLOR[t.modo] || "bg-gray-100 text-gray-600"}`}>
                    {MODO_LABEL[t.modo] || t.modo}
                  </span>
                  <span className="text-xs text-gray-400">{t.fecha}</span>
                </div>
                <button
                  onClick={() => setExpandido(expandido === t.id ? null : t.id)}
                  className="text-xs text-amber-600 hover:text-amber-800 transition-colors"
                >
                  {expandido === t.id ? "Ver menos" : "Ver cartas"}
                </button>
              </div>

              {t.pregunta && (
                <p className="mt-2 text-sm text-gray-700 italic">"{t.pregunta}"</p>
              )}

              {expandido === t.id && (
                <div className="mt-3 space-y-1">
                  {t.cartas?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-amber-400">•</span>
                      <span className="font-medium text-gray-500 w-20 shrink-0">{c.posicion}:</span>
                      <span>{c.nombreCarta}</span>
                      {c.isReversed && <span className="text-red-400 text-xs">(inv.)</span>}
                    </div>
                  ))}
                </div>
              )}

              {t.resumen && (
                <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-3">
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
