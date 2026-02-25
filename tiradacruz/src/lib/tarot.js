import cartasData from "./tarot-data.json"
import { mezclarArray } from "./baraja"

export { mezclarArray }

export const POSICIONES = ["Presente", "Futuro", "Resultado", "Pasado", "Consejo"]

// Divide en 3 montones y los reensambla según el orden elegido por el usuario
// orden: array de 3 índices [0,1,2] en el orden elegido, ej: [1, 0, 2]
export const cortarTresMontones = (mazo, orden) => {
  const tam = Math.floor(mazo.length / 3)
  const montones = [
    mazo.slice(0, tam),
    mazo.slice(tam, tam * 2),
    mazo.slice(tam * 2),
  ]
  return [...montones[orden[0]], ...montones[orden[1]], ...montones[orden[2]]]
}

// Crea la baraja según el modo:
// "mayores" → 22 Arcanos Mayores (type === "mayor")
// "completo" → 78 cartas
export const crearBarajaTarot = (modo) => {
  const cartas = modo === "mayores"
    ? cartasData.filter((c) => c.type === "mayor")
    : cartasData
  return cartas.map((c) => ({ ...c, id: c.name_short }))
}

// Construye el string de contexto para el prompt de IA
// Incluye significado derecho/invertido según isReversed
export const buildCartasContextoTarot = (cartasTirada) =>
  cartasTirada
    .map((carta, i) => {
      const estado = carta.isReversed ? "invertida" : "al derecho"
      const significado = carta.isReversed ? carta.meaning_rev : carta.meaning_up
      return `  - ${POSICIONES[i]}: ${carta.name} (${estado})\n    Significado: ${significado}`
    })
    .join("\n")
