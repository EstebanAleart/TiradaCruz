export const PALOS = ["oros", "copas", "espadas", "bastos"]
export const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12] // 10=Sota, 11=Caballo, 12=Rey

export const PALOS_NOMBRES = {
  oros: "Oros",
  copas: "Copas",
  espadas: "Espadas",
  bastos: "Bastos",
}

export const VALOR_NOMBRES = {
  1: "As",
  2: "Dos",
  3: "Tres",
  4: "Cuatro",
  5: "Cinco",
  6: "Seis",
  7: "Siete",
  10: "Sota",
  11: "Caballo",
  12: "Rey",
}

export const crearBaraja = () => {
  const baraja = []
  PALOS.forEach((palo) => {
    VALORES.forEach((valor) => {
      baraja.push({ palo, valor, id: `${palo}-${valor}` })
    })
  })
  return baraja
}

// Fisher-Yates shuffle
export const mezclarArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const cortarMazo = (mazo, posicion) => {
  return [...mazo.slice(posicion), ...mazo.slice(0, posicion)]
}
