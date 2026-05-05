"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "¿Es gratis la tirada de cartas?",
    a: "Sí, completamente gratis. Podés hacer todas las consultas que quieras, sin registro ni tarjeta de crédito.",
  },
  {
    q: "¿Qué son las cartas españolas?",
    a: "La baraja española es un mazo tradicional de 40 cartas divididas en cuatro palos: oros, copas, espadas y bastos. Es muy usada para lecturas de tarot en Argentina, España y toda Latinoamérica.",
  },
  {
    q: "¿Qué es la tirada en cruz?",
    a: "La tirada en cruz usa 5 cartas dispuestas en forma de cruz que representan el presente, futuro, resultado, pasado y consejo. Es una de las consultas más populares del tarot.",
  },
  {
    q: "¿Cómo funciona la interpretación con IA?",
    a: "Usamos inteligencia artificial avanzada para interpretar tus cartas de forma personalizada según tu pregunta. La IA conoce el significado de cada carta, su posición en la tirada y el contexto de lo que estás consultando.",
  },
  {
    q: "¿Puedo consultar desde Rosario o cualquier ciudad de Argentina?",
    a: "Sí, TiradaCruz funciona desde cualquier dispositivo con internet, en todo el país: Buenos Aires, Rosario, Córdoba, Mendoza, y más.",
  },
]

export default function FAQ() {
  const [abierto, setAbierto] = useState(null)

  return (
    <section className="mt-10 mb-16">
      <h2 className="text-lg font-bold text-white mb-4">Preguntas frecuentes</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0c0c18" }}
          >
            <button
              className="w-full text-left px-5 py-4 font-medium text-slate-300 flex justify-between items-center gap-4 hover:text-white transition-colors"
              onClick={() => setAbierto(abierto === i ? null : i)}
            >
              <span className="text-sm">{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-600 shrink-0 transition-transform duration-200 ${abierto === i ? "rotate-180" : ""}`}
              />
            </button>
            {abierto === i && (
              <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="pt-3">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
