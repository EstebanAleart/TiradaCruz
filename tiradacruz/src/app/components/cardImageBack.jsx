// Componente para el reverso de la carta con patrón de rombos CSS
export default function CardBackImage ({ className = "" }) {
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