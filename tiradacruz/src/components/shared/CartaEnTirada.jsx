import { CardBackImage, CardImage } from "@/components/espanolas/CardImage"

export default function CartaEnTirada({ carta, posicion, mostrar, isReversed, delay = 0 }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
        {posicion}
      </span>
      <div
        className={`hover:scale-105 transition-transform duration-200 ${
          isReversed ? "rotate-180" : ""
        }`}
      >
        {mostrar && carta ? (
          <div className="carta-reveal" style={{ animationDelay: `${delay}ms` }}>
            <CardImage palo={carta.palo} valor={carta.valor} className="hover:shadow-lg" />
          </div>
        ) : (
          <CardBackImage className="hover:shadow-lg" />
        )}
      </div>
    </div>
  )
}
