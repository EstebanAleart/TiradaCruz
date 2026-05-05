"use client"

import { useState } from "react"
import TiradaEspanola from "@/components/espanolas/TiradaEspanola"
import TiradaTarot from "@/components/tarot/TiradaTarot"
import HistorialPanel from "@/components/shared/HistorialPanel"
import { ChevronRight } from "lucide-react"

const SUBMODOS_TAROT = [
  { id: "mayores", label: "22 Arcanos Mayores", desc: "Los grandes arquetipos del alma" },
  { id: "completo", label: "78 Cartas", desc: "Arcanos mayores y menores" },
]

export default function ModoApp() {
  const [modo, setModo] = useState("espanolas")
  const [submodoTarot, setSubmodoTarot] = useState(null)

  return (
    <div className="w-full">
      {/* Tab switcher */}
      <div
        className="flex rounded-2xl p-1 mb-6"
        style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={() => setModo("espanolas")}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
          style={
            modo === "espanolas"
              ? { background: "#d97706", color: "#000" }
              : { color: "#475569" }
          }
        >
          🃏 Baraja Española
        </button>
        <button
          onClick={() => { setModo("tarot"); setSubmodoTarot(null) }}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
          style={
            modo === "tarot"
              ? { background: "#7c3aed", color: "#fff" }
              : { color: "#475569" }
          }
        >
          🔮 Tarot
        </button>
      </div>

      {/* Submodo tarot */}
      {modo === "tarot" && !submodoTarot && (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-slate-500 text-sm text-center mb-4">¿Con qué mazo querés trabajar?</p>
          <div className="flex flex-col gap-2">
            {SUBMODOS_TAROT.map((sm) => (
              <button
                key={sm.id}
                onClick={() => setSubmodoTarot(sm.id)}
                className="flex items-center justify-between px-4 py-4 rounded-xl transition-all text-left group hover:brightness-110"
                style={{ border: "1px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.06)" }}
              >
                <div>
                  <p className="text-white font-semibold text-sm">{sm.label}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{sm.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600 group-hover:text-purple-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {modo === "espanolas" && <TiradaEspanola />}
      {modo === "tarot" && submodoTarot && <TiradaTarot modo={submodoTarot} />}

      <HistorialPanel />
    </div>
  )
}
