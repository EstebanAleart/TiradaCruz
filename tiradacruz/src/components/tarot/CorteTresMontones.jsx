"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"

const LABELS = ["Mente", "Emoción", "Acción"]

function Monton({ idx, orden, onClick }) {
  const pos = orden.indexOf(idx)
  const seleccionado = pos !== -1

  return (
    <button
      onClick={() => !seleccionado && onClick(idx)}
      className="flex flex-col items-center gap-3 group focus:outline-none active:scale-95 transition-transform"
    >
      <div className="relative w-[72px] h-[108px]">
        {[3, 2, 1, 0].map((i) => (
          <div
            key={i}
            className="absolute w-[72px] h-[108px] rounded-xl transition-all duration-300"
            style={{
              top: i * 2.5,
              left: i * 1.5,
              zIndex: 4 - i,
              background: seleccionado
                ? "linear-gradient(135deg, #78350f 0%, #92400e 100%)"
                : "linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #1e1b4b 100%)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: seleccionado
                ? "rgba(251,191,36,0.35)"
                : i === 0
                ? "rgba(167,139,250,0.5)"
                : "rgba(167,139,250,0.15)",
            }}
          />
        ))}

        {seleccionado ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-0.5">
            <span className="text-3xl font-bold text-amber-300 drop-shadow">{pos + 1}</span>
            <span className="text-[10px] font-semibold text-amber-400/70 tracking-wide uppercase">{LABELS[pos]}</span>
          </div>
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
            <span className="text-purple-300 text-xs font-medium">Tocá</span>
          </div>
        )}
      </div>

      <span className={`text-xs font-medium transition-colors ${seleccionado ? "text-amber-600/60" : "text-slate-500 group-hover:text-slate-300"}`}>
        Montón {idx + 1}
      </span>
    </button>
  )
}

export default function CorteTresMontones({ onCortar }) {
  const [orden, setOrden] = useState([])

  const handleClick = (idx) => {
    if (orden.includes(idx)) return
    const nuevo = [...orden, idx]
    setOrden(nuevo)
    if (nuevo.length === 3) {
      setTimeout(() => onCortar(nuevo), 450)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-slate-200 text-sm font-medium">Elegí el orden de los montones</p>
        <p className="text-slate-500 text-xs mt-1">
          1° Mente · 2° Emoción · 3° Acción
        </p>
      </div>

      <div className="flex gap-5 justify-center items-start">
        {[0, 1, 2].map((idx) => (
          <Monton key={idx} idx={idx} orden={orden} onClick={handleClick} />
        ))}
      </div>

      <div className="h-6 flex items-center gap-3">
        {orden.length === 0 && (
          <p className="text-slate-600 text-xs">Tocá el que más te llame primero</p>
        )}
        {orden.length > 0 && orden.length < 3 && (
          <button
            onClick={() => setOrden([])}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Resetear
          </button>
        )}
        {orden.length === 3 && (
          <p className="text-purple-400/70 text-xs animate-pulse">Uniendo el mazo...</p>
        )}
      </div>
    </div>
  )
}
