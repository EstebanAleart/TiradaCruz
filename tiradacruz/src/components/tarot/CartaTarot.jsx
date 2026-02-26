// Carta de tarot individual: usa la URL de imagen de la API
// Respeta el mismo patrón visual que CartaEnTirada (espanolas/shared)

function CartaTarotBack() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tarot/reverso.jpg"
      alt="Dorso de carta de tarot"
      className="w-24 h-36 md:w-28 md:h-44 rounded-xl object-cover shadow-lg border border-purple-800"
    />
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

export default function CartaTarotEnTirada({ carta, posicion, mostrar, isReversed, delay = 0 }) {
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
            <CartaTarotFront carta={carta} />
          </div>
        ) : (
          <CartaTarotBack />
        )}
      </div>
      {mostrar && carta && (
        <span className="carta-reveal text-xs text-gray-600 text-center max-w-[7rem] leading-tight" style={{ animationDelay: `${delay + 200}ms` }}>
          {carta.name}
        </span>
      )}
    </div>
  )
}
