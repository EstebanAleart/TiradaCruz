"use client"
import { useState, useEffect } from "react"

export default function CartaTarotEnTirada({ carta, posicion, mostrar, isReversed, delay = 0 }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (mostrar && carta) {
      const t = setTimeout(() => setFlipped(true), delay)
      return () => clearTimeout(t)
    }
    setFlipped(false)
  }, [mostrar, carta, delay])

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div style={{ perspective: "800px", width: 68, height: 102 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Reverso */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <img
              src="/tarot/reverso.jpg"
              alt="Reverso"
              className="w-full h-full object-cover rounded-xl border border-purple-900/30 shadow-lg"
            />
          </div>
          {/* Frente */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div style={{ transform: isReversed ? "rotate(180deg)" : "none", width: "100%", height: "100%" }}>
              {carta && (
                <img
                  src={carta.image}
                  alt={carta.name}
                  className="w-full h-full object-cover rounded-xl border border-purple-500/40 shadow-xl shadow-purple-900/30"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-purple-400/50 tracking-widest uppercase text-center w-[68px] leading-tight">
        {posicion}
      </span>
    </div>
  )
}
