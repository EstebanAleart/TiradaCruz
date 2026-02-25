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
    a: "La tirada en cruz es una de las consultas más populares del tarot. Usa 5 cartas dispuestas en forma de cruz que representan el presente, futuro, resultado, pasado y consejo.",
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
      <div className="bg-white/70 rounded-2xl p-8 shadow border border-amber-100">
        <h2 className="text-3xl font-bold text-amber-900 mb-6">Preguntas Frecuentes</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-amber-200 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 font-semibold text-amber-900 flex justify-between items-center hover:bg-amber-50 transition-colors"
                onClick={() => setAbierto(abierto === i ? null : i)}
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-600 transition-transform ${
                    abierto === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {abierto === i && (
                <div className="px-6 py-4 text-gray-700 bg-amber-50/50 border-t border-amber-100">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
