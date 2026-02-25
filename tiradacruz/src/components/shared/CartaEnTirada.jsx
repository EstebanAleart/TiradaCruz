import { CardBackImage, CardImage } from "@/components/espanolas/CardImage"

export default function CartaEnTirada({ carta, posicion, mostrar, isReversed }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
        {posicion}
      </span>
      <div
        className={`transform transition-all duration-700 hover:scale-105 ${
          isReversed ? "rotate-180" : ""
        }`}
      >
        {mostrar && carta ? (
          <CardImage palo={carta.palo} valor={carta.valor} className="hover:shadow-lg" />
        ) : (
          <CardBackImage className="hover:shadow-lg" />
        )}
      </div>
    </div>
  )
}
