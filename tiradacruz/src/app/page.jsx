"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, RotateCcw, Play, Sparkles, ChevronDown } from "lucide-react"
import { CardBackImage, CardImage } from "./components/card-image"

// Definir los palos y valores de la baraja española
const PALOS = ["oros", "copas", "espadas", "bastos"]
const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12] // 10=Sota, 11=Caballo, 12=Rey

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

const crearBaraja = () => {
  const baraja = []
  PALOS.forEach((palo) => {
    VALORES.forEach((valor) => {
      baraja.push({ palo, valor, id: `${palo}-${valor}` })
    })
  })
  return baraja
}

const mezclarArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const cortarMazo = (mazo, posicion) => {
  return [...mazo.slice(posicion), ...mazo.slice(0, posicion)]
}

const CartaEnTirada = ({ carta, posicion, mostrar, isReversed }) => {
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

const FAQ_ITEMS = [
  {
    q: "¿Es gratis la tirada de cartas?",
    a: "Sí, completamente gratis. Podés hacer todas las consultas que quieras, sin registro ni tarjeta de crédito.",
  },
  {
    q: "¿Qué son las cartas españolas?",
    a: "La baraja española es un mazo tradicional de 40 cartas divididas en cuatro palos: oros, copas, espadas y bastos. Es muy usada para lecturas de tarot en Argentina, España y toda Latinoamérica.",
  },
  {
    q: "¿Qué es la tirada en cruz?",
    a: "La tirada en cruz es una de las consultas más populares del tarot. Usa 5 cartas dispuestas en forma de cruz que representan el presente, futuro, resultado, pasado y consejo.",
  },
  {
    q: "¿Cómo funciona la interpretación con IA?",
    a: "Usamos inteligencia artificial avanzada para interpretar tus cartas de forma personalizada según tu pregunta. La IA conoce el significado de cada carta, su posición en la tirada y el contexto de lo que estás consultando.",
  },
  {
    q: "¿Puedo consultar desde Rosario o cualquier ciudad de Argentina?",
    a: "Sí, TiradaCruz funciona desde cualquier dispositivo con internet, en todo el país: Buenos Aires, Rosario, Córdoba, Mendoza, y más.",
  },
]

export default function TiradaCartasEspanolas() {
  const [mazo, setMazo] = useState([])
  const [cartasTirada, setCartasTirada] = useState([null, null, null, null, null])
  const [mostrarCartas, setMostrarCartas] = useState(false)
  const [mezclas, setMezclas] = useState(0)
  const [cortes, setCortes] = useState(0)
  const [mensaje, setMensaje] = useState("Mezcla las cartas, luego córtalas 1 vez para poder realizar la tirada")
  const [preguntaUsuario, setPreguntaUsuario] = useState("")
  const [interpretacion, setInterpretacion] = useState("")
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState("")
  const [faqAbierto, setFaqAbierto] = useState(null)

  useEffect(() => {
    setMazo(crearBaraja())
  }, [])

  const mezclarMazo = () => {
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
    setMensaje(`Mazo mezclado ${mezclas + 1} veces`)
    setMostrarCartas(false)
    setCartasTirada([null, null, null, null, null])
    setInterpretacion("")
    setErrorIA("")
  }

  const cortarMazoHandler = () => {
    if (cortes < 1 && mezclas > 0) {
      const posicionCorte = Math.floor(Math.random() * (mazo.length - 10)) + 5
      setMazo((prev) => cortarMazo(prev, posicionCorte))
      setCortes((prev) => prev + 1)
      setMensaje(`Mazo cortado ${cortes + 1}/1 vez`)
      setMostrarCartas(false)
      setCartasTirada([null, null, null, null, null])
      setInterpretacion("")
      setErrorIA("")
    }
  }

  const realizarTirada = () => {
    if (mezclas >= 1 && cortes === 1) {
      const nuevasCartas = mazo.slice(0, 5).map((card) => ({
        ...card,
        isReversed: Math.random() < 0.5,
      }))
      setCartasTirada(nuevasCartas)
      setMostrarCartas(true)
      setMensaje("¡Tirada realizada! Pedí la interpretación con IA cuando quieras.")
      setInterpretacion("")
      setErrorIA("")
    } else {
      setMensaje("Por favor, mezcla las cartas al menos una vez y córtalas 1 vez.")
    }
  }

  const interpretarConIA = async () => {
    if (!mostrarCartas || cartasTirada.some((c) => c === null)) {
      return
    }

    setCargandoIA(true)
    setInterpretacion("")
    setErrorIA("")

    try {
      const cartasPayload = cartasTirada.map((carta) => ({
        nombreCarta: `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`,
        isReversed: carta.isReversed,
      }))

      const res = await fetch("/api/interpretacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartas: cartasPayload, pregunta: preguntaUsuario }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorIA(data.error || "Error al obtener la interpretación")
      } else {
        setInterpretacion(data.interpretacion)
      }
    } catch {
      setErrorIA("No se pudo conectar con el servicio de IA. Verificá tu conexión.")
    } finally {
      setCargandoIA(false)
    }
  }

  const reiniciar = () => {
    setMazo(crearBaraja())
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCortes(0)
    setMensaje("Mezcla las cartas, luego córtalas 1 vez para poder realizar la tirada")
    setPreguntaUsuario("")
    setInterpretacion("")
    setErrorIA("")
  }

  const puedeCortar = mezclas > 0 && cortes < 1
  const puedeRealizar = mezclas >= 1 && cortes === 1
  const puedeInterpretar = mostrarCartas && !cargandoIA

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">

      {/* HERO SEO */}
      <header className="bg-gradient-to-br from-amber-900 via-red-900 to-purple-950 text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest mb-3">
            Tarot Online Gratis · Argentina · Rosario
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Tirada de Cartas Españolas en Cruz
          </h1>
          <p className="text-amber-100 text-lg mb-6">
            Mezclá, cortá y revelá tus cartas. Recibí tu interpretación personalizada con Inteligencia Artificial,
            al instante y sin costo. El mejor tarot online de Argentina.
          </p>
          <div className="flex justify-center gap-3 flex-wrap text-sm">
            <span className="bg-amber-800/50 border border-amber-600 rounded-full px-4 py-1">✦ 100% Gratis</span>
            <span className="bg-amber-800/50 border border-amber-600 rounded-full px-4 py-1">✦ Sin registro</span>
            <span className="bg-amber-800/50 border border-amber-600 rounded-full px-4 py-1">✦ IA en español argentino</span>
          </div>
        </div>
      </header>

      {/* APP PRINCIPAL */}
      <main className="max-w-6xl mx-auto p-4 py-10">

        <div className="text-center mb-8">
          <p className="text-amber-700 mb-6 text-lg font-medium">{mensaje}</p>

          {/* Pregunta del usuario */}
          <div className="bg-white/80 rounded-xl p-6 shadow-lg border border-amber-200 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-amber-900">Tu Pregunta para la Tirada</h2>
            <label htmlFor="user-question" className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Escribí tu pregunta (opcional):
            </label>
            <textarea
              id="user-question"
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Ej: ¿Cómo va a evolucionar mi trabajo en los próximos meses?"
              value={preguntaUsuario}
              onChange={(e) => setPreguntaUsuario(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2 text-left">
              La IA va a usar tu pregunta para darte una lectura más personalizada.
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
              Cortar ({cortes}/1)
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
              onClick={interpretarConIA}
              disabled={!puedeInterpretar}
              variant={!puedeInterpretar ? "secondary" : "default"}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
            >
              <Sparkles className="w-5 h-5" />
              {cargandoIA ? "Interpretando..." : "Interpretar con IA"}
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

        {/* Disposición en cruz */}
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:grid-rows-3 md:gap-x-16 md:gap-y-8 md:items-center md:justify-items-center">
          <div className="md:col-start-2 md:row-start-1">
            <CartaEnTirada carta={cartasTirada[1]} posicion="Futuro" mostrar={mostrarCartas} isReversed={cartasTirada[1]?.isReversed} />
          </div>
          <div className="md:col-start-1 md:row-start-2">
            <CartaEnTirada carta={cartasTirada[3]} posicion="Pasado" mostrar={mostrarCartas} isReversed={cartasTirada[3]?.isReversed} />
          </div>
          <div className="md:col-start-2 md:row-start-2">
            <CartaEnTirada carta={cartasTirada[0]} posicion="Presente" mostrar={mostrarCartas} isReversed={cartasTirada[0]?.isReversed} />
          </div>
          <div className="md:col-start-3 md:row-start-2">
            <CartaEnTirada carta={cartasTirada[4]} posicion="Consejo" mostrar={mostrarCartas} isReversed={cartasTirada[4]?.isReversed} />
          </div>
          <div className="md:col-start-2 md:row-start-3">
            <CartaEnTirada carta={cartasTirada[2]} posicion="Resultado" mostrar={mostrarCartas} isReversed={cartasTirada[2]?.isReversed} />
          </div>
        </div>

        {/* Estado del mazo */}
        <div className="mt-8 text-center">
          <div className="bg-white/70 rounded-xl p-4 inline-block shadow-sm border border-amber-200">
            <p className="text-sm text-amber-800 font-medium">
              Cartas en el mazo: {mazo.length} | Mezclas: {mezclas} | Cortes: {cortes}/1
            </p>
          </div>
        </div>

        {/* Panel de interpretación IA */}
        {cargandoIA && (
          <div className="mt-10 bg-white/90 rounded-2xl p-8 shadow-xl border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-3 text-amber-700">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <p className="text-lg font-medium">La IA está leyendo tus cartas...</p>
            </div>
          </div>
        )}

        {errorIA && (
          <div className="mt-10 bg-red-50 rounded-2xl p-6 shadow border border-red-200">
            <p className="text-red-700 font-medium">{errorIA}</p>
          </div>
        )}

        {interpretacion && (
          <div className="mt-10 bg-gradient-to-br from-amber-900 via-red-950 to-purple-950 rounded-2xl p-8 shadow-2xl border border-amber-700">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-amber-100">Tu Lectura</h2>
            </div>
            <div className="text-amber-100 leading-relaxed whitespace-pre-wrap text-base">
              {interpretacion}
            </div>
          </div>
        )}

        {/* CONTENIDO SEO - Descripción del servicio */}
        <section className="mt-20 prose prose-amber max-w-none">
          <div className="bg-white/70 rounded-2xl p-8 shadow border border-amber-100">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              El Tarot Online Más Auténtico de Argentina
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              TiradaCruz te ofrece una experiencia de <strong>lectura de cartas españolas online</strong> completamente
              gratuita, con interpretaciones generadas por inteligencia artificial entrenada en la tradición del tarot argentino.
              Ya seas de <strong>Rosario</strong>, Buenos Aires, Córdoba o cualquier rincón del país, podés consultar
              las cartas desde tu celular o computadora cuando quieras.
            </p>
            <p className="text-gray-700 text-lg mb-4">
              La <strong>tirada en cruz</strong> es una de las lecturas más poderosas de la baraja española. Cinco cartas
              que revelan tu pasado, presente, futuro, el resultado probable y el consejo que las cartas tienen para vos.
              Nuestra IA interpreta cada carta en su posición y te da una lectura cohesiva y personalizada.
            </p>
            <p className="text-gray-700 text-lg">
              No necesitás experiencia previa. Mezcla las cartas, cortá el mazo, revelá la tirada y pedile a la
              <strong> IA</strong> que te explique qué te dicen las cartas. Simple, rápido y gratuito.
            </p>
          </div>
        </section>

        {/* FAQ SEO */}
        <section className="mt-10 mb-16">
          <div className="bg-white/70 rounded-2xl p-8 shadow border border-amber-100">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">Preguntas Frecuentes</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border border-amber-200 rounded-xl overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-4 font-semibold text-amber-900 flex justify-between items-center hover:bg-amber-50 transition-colors"
                    onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-600 transition-transform ${faqAbierto === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {faqAbierto === i && (
                    <div className="px-6 py-4 text-gray-700 bg-amber-50/50 border-t border-amber-100">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-amber-900 text-amber-200 text-center py-6 text-sm">
        <p>TiradaCruz &copy; {new Date().getFullYear()} · Tarot Online Gratis · Argentina</p>
        <p className="text-amber-400 mt-1 text-xs">Las lecturas son de carácter orientativo y no reemplazan el consejo profesional.</p>
      </footer>
    </div>
  )
}
