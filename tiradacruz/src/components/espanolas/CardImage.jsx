export const CardImage = ({ palo, valor, className = "" }) => {
  return (
    <img
      src={`/cards/${String(valor).padStart(2, "0")}-${palo}.png`}
      alt={`${valor} de ${palo}`}
      width={120}
      height={168}
      className={`rounded-lg shadow-md border-2 border-gray-300 ${className}`}
      style={{ objectFit: "contain" }}
    />
  )
}

export const CardBackImage = ({ className = "" }) => {
  return (
    <img
      src="/cards/reverso.png"
      alt="Reverso de la carta española"
      width={120}
      height={168}
      className={`rounded-lg shadow-md border-2 border-gray-300 ${className}`}
      style={{ objectFit: "contain" }}
    />
  )
}
