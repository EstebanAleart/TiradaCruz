const KEY = "tiradacruz_historial"
const MAX_ITEMS = 3

export const guardarTirada = ({ pregunta, cartas, resumen, modo }) => {
  try {
    const historial = obtenerHistorial()
    const nueva = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      pregunta: pregunta?.trim() || null,
      cartas, // [{ nombreCarta, posicion, isReversed }]
      resumen: resumen?.slice(0, 180) || "",
      modo, // "espanolas" | "tarot_mayores" | "tarot_completo"
    }
    localStorage.setItem(KEY, JSON.stringify([nueva, ...historial].slice(0, MAX_ITEMS)))
  } catch {
    // localStorage no disponible (SSR, modo privado, etc.)
  }
}

export const obtenerHistorial = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}
