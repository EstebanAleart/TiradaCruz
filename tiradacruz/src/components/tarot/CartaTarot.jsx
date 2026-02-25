// Carta de tarot individual: usa la URL de imagen de la API
// Respeta el mismo patrón visual que CartaEnTirada (espanolas/shared)

const REVERSO_GRADIENT = "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-950"

function CartaTarotBack() {
  return (
    <div
      className={`w-24 h-36 md:w-28 md:h-44 rounded-xl ${REVERSO_GRADIENT} border border-purple-600 shadow-lg flex items-center justify-center`}
    >
      <span className="text-purple-400 text-3xl select-none">✦</span>
    </div>
  )
}

function CartaTarotFront({ carta }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={carta.image}
      alt={carta.name}
      className="w-24 h-36 md:w-28 md:h-44 rounded-xl object-cover shadow-lg border border-purple-400"
      loading="lazy"
    />
  )
}

export default function CartaTarotEnTirada({ carta, posicion, mostrar, isReversed }) {
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
          <CartaTarotFront carta={carta} />
        ) : (
          <CartaTarotBack />
        )}
      </div>
      {mostrar && carta && (
        <span className="text-xs text-gray-600 text-center max-w-[7rem] leading-tight">
          {carta.name}
        </span>
      )}
    </div>
  )
}
