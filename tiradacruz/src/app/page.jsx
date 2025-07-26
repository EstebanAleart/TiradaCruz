"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, RotateCcw, Play, ExternalLink } from "lucide-react"
import { CardImage, CardBackImage } from "./components/card-image"

// Definir los palos y valores de la baraja española
const PALOS = ["oros", "copas", "espadas", "bastos"]
const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12] // 10=Sota, 11=Caballo, 12=Rey

// Nombres para el prompt de IA
const PALOS_NOMBRES = {
  oros: "Oros",
  copas: "Copas",
  espadas: "Espadas",
  bastos: "Bastos",
}

const VALOR_NOMBRES = {
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

// Crear la baraja completa
const crearBaraja = () => {
  const baraja = []
  PALOS.forEach((palo) => {
    VALORES.forEach((valor) => {
      baraja.push({
        palo,
        valor,
        id: `${palo}-${valor}`,
      })
    })
  })
  return baraja
}

// Función para mezclar array
const mezclarArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Función para cortar el mazo
const cortarMazo = (mazo, posicion) => {
  return [...mazo.slice(posicion), ...mazo.slice(0, posicion)]
}

// Componente para mostrar una carta en la tirada
const CartaEnTirada = ({ carta, posicion, mostrar, isReversed }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9884098505893083"
     crossorigin="anonymous"></script></head>
      <span className="text-sm font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
        {posicion}
      </span>
      <div
        className={`transform transition-all duration-700 hover:scale-105 ${
          isReversed ? "rotate-180" : "" // Aplicar rotación 2D para visibilidad
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

export default function TiradaCartasEspanolas() {
  const [mazo, setMazo] = useState([])
  const [cartasTirada, setCartasTirada] = useState([null, null, null, null, null])
  const [mostrarCartas, setMostrarCartas] = useState(false)
  const [mezclas, setMezclas] = useState(0)
  const [cortes, setCortes] = useState(0)
  const [mensaje, setMensaje] = useState("Mezcla las cartas, luego córtalas 3 veces para poder realizar la tirada")
  const [preguntaUsuario, setPreguntaUsuario] = useState("") // Estado para la pregunta

  // Inicializar el mazo
  useEffect(() => {
    setMazo(crearBaraja())
  }, [])

  const mezclarMazo = () => {
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
    setMensaje(`Mazo mezclado ${mezclas + 1} veces`)
    setMostrarCartas(false) // Ocultar cartas y resetear tirada al mezclar
    setCartasTirada([null, null, null, null, null])
  }

  const cortarMazoHandler = () => {
    if (cortes < 3 && mezclas > 0) {
      const posicionCorte = Math.floor(Math.random() * (mazo.length - 10)) + 5
      setMazo((prev) => cortarMazo(prev, posicionCorte))
      setCortes((prev) => prev + 1)
      setMensaje(`Mazo cortado ${cortes + 1}/3 veces`)
      setMostrarCartas(false) // Ocultar cartas y resetear tirada al cortar
      setCartasTirada([null, null, null, null, null])
    }
  }

  const realizarTirada = () => {
    if (mezclas >= 1 && cortes === 3) {
      // Tomar las primeras 5 cartas del mazo mezclado y cortado
      const nuevasCartas = mazo.slice(0, 5).map((card) => ({
        ...card,
        isReversed: Math.random() < 0.5, // 50% de probabilidad de que salga invertida
      }))
      setCartasTirada(nuevasCartas)
      setMostrarCartas(true) // Mostrar las cartas en la app
      setMensaje("¡Tirada realizada! Ahora puedes abrir ChatGPT para la interpretación.")
    } else {
      setMensaje("Por favor, mezcla las cartas al menos una vez y córtalas 3 veces.")
    }
  }

  const abrirChatGPTConInterpretacion = () => {
    if (!mostrarCartas || cartasTirada.some((carta) => carta === null)) {
      alert("Primero debes realizar una tirada de cartas para obtener una interpretación.")
      return
    }

    let prompt = ` He realizado una tirada de cartas españolas en cruz. Necesito tu ayuda para interpretar esta tirada.

Las posiciones de la cruz son:
- Carta 1 (Centro): Presente - Mi situación actual.
- Carta 2 (Arriba): Futuro - Lo que está por venir.
- Carta 3 (Abajo): Resultado - El desenlace final.
- Carta 4 (Izquierda): Pasado - Influencias del pasado.
- Carta 5 (Derecha): Consejo - Guía para actuar.

Aquí están las cartas de mi tirada:
`

    cartasTirada.forEach((carta, index) => {
      const nombreCarta = `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`
      const estado = carta.isReversed ? "invertida" : "al derecho"
      prompt += `\n- Carta ${index + 1} (${nombreCarta}, ${estado})`
    })

    if (preguntaUsuario.trim() !== "") {
      prompt += `\n\nMi pregunta específica es: "${preguntaUsuario.trim()}"`
    }

    prompt += `\n\nPor favor, proporciona una interpretación detallada y cohesiva de esta tirada, considerando mi pregunta (si la hay) y el significado de cada carta en su posición. Utiliza un tono místico y sabio.`

    // Codificar el prompt para la URL y abrir ChatGPT
    const encodedPrompt = encodeURIComponent(prompt)
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`
    window.open(chatGPTUrl, "_blank")
  }

  const reiniciar = () => {
    setMazo(crearBaraja())
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCortes(0)
    setMensaje("Mezcla las cartas, luego córtalas 3 veces para poder realizar la tirada")
    setPreguntaUsuario("")
  }

  const puedeCortar = mezclas > 0 && cortes < 3
  const puedeRealizar = mezclas >= 1 && cortes === 3
  const puedeAbrirChatGPT = mostrarCartas // Solo se activa si ya se realizó la tirada

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-900 mb-2 drop-shadow-sm">Tirada de Cartas Españolas en Cruz</h1>
          <p className="text-amber-700 mb-6 text-lg font-medium">{mensaje}</p>

          {/* Sección de pregunta del usuario */}
          <div className="bg-white/80 rounded-xl p-6 shadow-lg border border-amber-200 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-center text-amber-900">Tu Pregunta para la Tirada</h3>
            <div className="mb-4">
              <label htmlFor="user-question" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                Escribe tu pregunta específica (opcional):
              </label>
              <textarea
                id="user-question"
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ej: ¿Cómo afectará esto a mi carrera profesional en los próximos meses?"
                value={preguntaUsuario}
                onChange={(e) => setPreguntaUsuario(e.target.value)}
              ></textarea>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-left">
              Esta pregunta se enviará a ChatGPT junto con las cartas para una interpretación más personalizada.
            </p>
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <Button
              onClick={mezclarMazo}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <Shuffle className="w-5 h-5" />
              Mezclar ({mezclas})
            </Button>

            <Button
              onClick={cortarMazoHandler}
              disabled={!puedeCortar}
              variant={!puedeCortar ? "secondary" : "default"}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
            >
              <RotateCcw className="w-5 h-5" />
              Cortar ({cortes}/3)
            </Button>

            <Button
              onClick={realizarTirada}
              disabled={!puedeRealizar}
              variant={!puedeRealizar ? "secondary" : "default"}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              <Play className="w-5 h-5" />
              Realizar Tirada
            </Button>

            <Button
              onClick={abrirChatGPTConInterpretacion}
              disabled={!puedeAbrirChatGPT}
              variant={!puedeAbrirChatGPT ? "secondary" : "default"}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
            >
              <ExternalLink className="w-5 h-5" />
              Abrir ChatGPT con Interpretación
            </Button>

            <Button
              onClick={reiniciar}
              variant="outline"
              className="flex items-center gap-2 bg-white/80 hover:bg-white border-amber-300 text-amber-800 px-6 py-3"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </Button>
          </div>
        </div>

        {/* Disposición en cruz - Responsive con CSS Grid */}
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:grid-rows-3 md:gap-x-16 md:gap-y-8 md:items-center md:justify-items-center">
          {/* Carta 2 (Futuro) - Arriba */}
          <div className="md:col-start-2 md:row-start-1">
            <CartaEnTirada
              carta={cartasTirada[1]}
              posicion="Futuro"
              mostrar={mostrarCartas}
              isReversed={cartasTirada[1]?.isReversed}
            />
          </div>

          {/* Carta 4 (Pasado) - Izquierda */}
          <div className="md:col-start-1 md:row-start-2">
            <CartaEnTirada
              carta={cartasTirada[3]}
              posicion="Pasado"
              mostrar={mostrarCartas}
              isReversed={cartasTirada[3]?.isReversed}
            />
          </div>

          {/* Carta 1 (Presente) - Centro */}
          <div className="md:col-start-2 md:row-start-2">
            <CartaEnTirada
              carta={cartasTirada[0]}
              posicion="Presente"
              mostrar={mostrarCartas}
              isReversed={cartasTirada[0]?.isReversed}
            />
          </div>

          {/* Carta 5 (Consejo) - Derecha */}
          <div className="md:col-start-3 md:row-start-2">
            <CartaEnTirada
              carta={cartasTirada[4]}
              posicion="Consejo"
              mostrar={mostrarCartas}
              isReversed={cartasTirada[4]?.isReversed}
            />
          </div>

          {/* Carta 3 (Resultado) - Abajo */}
          <div className="md:col-start-2 md:row-start-3">
            <CartaEnTirada
              carta={cartasTirada[2]}
              posicion="Resultado"
              mostrar={mostrarCartas}
              isReversed={cartasTirada[2]?.isReversed}
            />
          </div>
        </div>

        {/* Información del estado */}
        <div className="mt-8 text-center">
          <div className="bg-white/70 rounded-xl p-4 inline-block shadow-sm border border-amber-200">
            <p className="text-sm text-amber-800 font-medium">
              Cartas en el mazo: {mazo.length} | Mezclas: {mezclas} | Cortes: {cortes}/3
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
