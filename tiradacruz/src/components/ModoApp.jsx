"use client"

import { useState } from "react"
import TiradaEspanola from "@/components/espanolas/TiradaEspanola"

const MODOS = [
  {
    id: "espanolas",
    label: "Tirada en Cruz",
    sublabel: "Baraja Española",
    emoji: "🃏",
    disponible: true,
  },
  {
    id: "tarot",
    label: "Tirada en Cruz",
    sublabel: "Tarot Arcanos",
    emoji: "🔮",
    disponible: false,
  },
]

export default function ModoApp() {
  const [modo, setModo] = useState("espanolas")

  return (
    <>
      {/* Selector de modo */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {MODOS.map((m) => (
          <button
            key={m.id}
            onClick={() => m.disponible && setModo(m.id)}
            className={`relative flex flex-col items-center gap-1 px-8 py-5 rounded-2xl border-2 font-semibold transition-all shadow-md
              ${
                m.disponible
                  ? modo === m.id
                    ? "border-amber-500 bg-amber-900/20 text-amber-900 shadow-amber-200"
                    : "border-amber-200 bg-white/70 text-amber-800 hover:border-amber-400 hover:bg-amber-50"
                  : "border-gray-200 bg-white/40 text-gray-400 cursor-not-allowed"
              }`}
            title={m.disponible ? undefined : "Próximamente"}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-base">{m.label}</span>
            <span className="text-xs font-normal opacity-70">{m.sublabel}</span>
            {!m.disponible && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Pronto
              </span>
            )}
            {modo === m.id && m.disponible && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Contenido del modo seleccionado */}
      {modo === "espanolas" && <TiradaEspanola />}

      {modo === "tarot" && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-6xl mb-4">🔮</p>
          <p className="text-xl font-semibold text-amber-900">Próximamente</p>
          <p className="text-gray-500 mt-2">El tarot de Arcanos está en desarrollo.</p>
        </div>
      )}
    </>
  )
}
