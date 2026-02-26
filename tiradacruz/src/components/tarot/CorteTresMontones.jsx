"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"

const LABELS_ORDEN = ["Mente", "Emoción", "Acción"]

// Visualiza un montón de cartas boca abajo
function Monton({ idx, numeroSeleccion, onClick }) {
  const seleccionada = numeroSeleccion !== null

  return (
    <button
      onClick={() => onClick(idx)}
      disabled={seleccionada}
      className={`flex flex-col items-center gap-3 group transition-all ${
        seleccionada ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {/* Stack de cartas */}
      <div className="relative w-20 h-32">
        {[3, 2, 1, 0].map((i) => (
          <div
            key={i}
            className={`absolute w-20 h-32 rounded-xl border shadow-md transition-all duration-300 ${
              seleccionada
                ? "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 border-amber-500"
                : "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-950 border-purple-600 group-hover:border-purple-400"
            }`}
            style={{ top: i * 2, left: i * 1 }}
          />
        ))}

        {/* Número de selección superpuesto */}
        {seleccionada && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-4xl font-bold text-amber-300 drop-shadow-lg">
              {numeroSeleccion}
            </span>
          </div>
        )}

        {/* Indicador hover */}
        {!seleccionada && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <span className="text-purple-300 text-xs font-medium">Elegir</span>
          </div>
        )}
      </div>

      <span
        className={`text-sm font-medium transition-colors ${
          seleccionada ? "text-amber-700" : "text-purple-400 group-hover:text-purple-200"
        }`}
      >
        {seleccionada ? LABELS_ORDEN[numeroSeleccion - 1] : `Montón ${idx + 1}`}
      </span>
    </button>
  )
}

export default function CorteTresMontones({ onCortar }) {
  const [seleccion, setSeleccion] = useState([]) // [pilaIdx en orden de elección]

  const handleClickPila = (idx) => {
    if (seleccion.includes(idx)) return
    const nueva = [...seleccion, idx]
    setSeleccion(nueva)
    if (nueva.length === 3) {
      // Pequeño delay para que el usuario vea la selección completa
      setTimeout(() => onCortar(nueva), 400)
    }
  }

  const numeroPila = (idx) => {
    const pos = seleccion.indexOf(idx)
    return pos === -1 ? null : pos + 1
  }

  return (
    <div className="flex flex-col items-center gap-6 my-6">
      <div className="text-center">
        <p className="text-amber-800 font-medium mb-1">Corte en tres montones</p>
        <p className="text-amber-600/80 text-sm">
          Elegí el orden que más te llame — el primero será tu{" "}
          <span className="font-semibold">Mente</span>, el segundo tu{" "}
          <span className="font-semibold">Emoción</span>, el tercero tu{" "}
          <span className="font-semibold">Acción</span>.
        </p>
      </div>

      <div className="flex gap-8 justify-center items-end">
        {[0, 1, 2].map((idx) => (
          <Monton
            key={idx}
            idx={idx}
            numeroSeleccion={numeroPila(idx)}
            onClick={handleClickPila}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 h-8">
        {seleccion.length === 0 && (
          <p className="text-purple-400/70 text-xs italic">
            Tocá el montón que más te atraiga primero
          </p>
        )}
        {seleccion.length > 0 && seleccion.length < 3 && (
          <>
            <p className="text-amber-600 text-xs italic">
              Elegiste {seleccion.length} de 3...
            </p>
            <button
              onClick={() => setSeleccion([])}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-600 text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Resetear
            </button>
          </>
        )}
        {seleccion.length === 3 && (
          <p className="text-amber-700 text-xs italic">Corte realizado...</p>
        )}
      </div>
    </div>
  )
}
