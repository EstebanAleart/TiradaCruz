// Componente para renderizar cartas españolas usando imágenes PNG
export const CardImage = ({ palo, valor, className = "" }) => {
  const getImagePath = (palo, valor) => {
    // Las figuras (Sota, Caballo, Rey) usan 10, 11, 12 en el valor
    const cardValue = valor
    return `/cards/${String(cardValue).padStart(2, "0")}-${palo}.png`
  }

  return (
    <img
      src={getImagePath(palo, valor) || "/placeholder.svg"}
      alt={`${valor} de ${palo}`}
      width={120} // Aumentado
      height={168} // Aumentado
      className={`rounded-lg shadow-md border-2 border-gray-300 ${className}`}
      style={{ objectFit: "contain" }} // Asegura que la imagen se ajuste sin distorsión
    />
  )
}

// Componente para el reverso de la carta
export const CardBackImage = ({ className = "" }) => {
  return (
    <img
      src="/cards/reverso.png" // Usar la imagen de reverso
      alt="Reverso de la carta española"
      width={120}
      height={168}
      className={`rounded-lg shadow-md border-2 border-gray-300 ${className}`}
      style={{ objectFit: "contain" }}
    />
  )
}


