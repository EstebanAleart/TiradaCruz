"use client"

import { useState } from "react"
import TiradaEspanola from "@/components/espanolas/TiradaEspanola"
import TiradaTarot from "@/components/tarot/TiradaTarot"

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
    disponible: true,
  },
]

const SUBMODOS_TAROT = [
  {
    id: "mayores",
    label: "22 Arcanos Mayores",
    desc: "El camino del alma — los grandes arquetipos",
  },
  {
    id: "completo",
    label: "78 Cartas completas",
    desc: "Arcanos Mayores y Menores",
  },
]

export default function ModoApp() {
  const [modo, setModo] = useState("espanolas")
  const [submodoTarot, setSubmodoTarot] = useState(null) // null = aún no eligió

  const handleSeleccionarModo = (id) => {
    if (id === "tarot") {
      setSubmodoTarot(null) // resetea selección de submodo al cambiar a tarot
    }
    setModo(id)
  }

  return (
    <>
      {/* Selector de modo principal */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {MODOS.map((m) => (
          <button
            key={m.id}
            onClick={() => m.disponible && handleSeleccionarModo(m.id)}
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
            {modo === m.id && m.disponible && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Selector de submodo tarot */}
      {modo === "tarot" && submodoTarot === null && (
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-amber-800 font-medium">¿Con qué mazo querés trabajar?</p>
          <div className="flex gap-4 flex-wrap justify-center">
            {SUBMODOS_TAROT.map((sm) => (
              <button
                key={sm.id}
                onClick={() => setSubmodoTarot(sm.id)}
                className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl border-2 border-purple-300 bg-white/70 text-purple-900 hover:border-purple-500 hover:bg-purple-50 transition-all shadow-sm font-semibold"
              >
                <span className="text-base">{sm.label}</span>
                <span className="text-xs font-normal text-purple-500">{sm.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido */}
      {modo === "espanolas" && <TiradaEspanola />}
      {modo === "tarot" && submodoTarot && <TiradaTarot modo={submodoTarot} />}
    </>
  )
}
