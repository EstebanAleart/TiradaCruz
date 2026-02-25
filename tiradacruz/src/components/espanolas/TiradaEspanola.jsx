"use client"

import { useState, useEffect } from "react"
import {
  crearBaraja,
  mezclarArray,
  cortarMazo,
  PALOS_NOMBRES,
  VALOR_NOMBRES,
} from "@/lib/baraja"
import Controls from "@/components/espanolas/Controls"
import EstadoMazo from "@/components/espanolas/EstadoMazo"
import CruzLayout from "@/components/shared/CruzLayout"
import ChatLectura from "@/components/espanolas/ChatLectura"
import PreguntaInput from "@/components/shared/PreguntaInput"

const MENSAJE_INICIAL = "Mezcla las cartas, luego córtalas 1 vez para poder realizar la tirada"

const POSICIONES = ["Presente", "Futuro", "Resultado", "Pasado", "Consejo"]

// Arma el string de contexto de cartas que va fijo en el system prompt
const buildCartasContexto = (cartasTirada) =>
  cartasTirada
    .map((carta, i) => {
      const estado = carta.isReversed ? "invertida" : "al derecho"
      const nombre = `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`
      return `  - ${POSICIONES[i]}: ${nombre} (${estado})`
    })
    .join("\n")

export default function TiradaEspanola() {
  const [mazo, setMazo] = useState([])
  const [cartasTirada, setCartasTirada] = useState([null, null, null, null, null])
  const [mostrarCartas, setMostrarCartas] = useState(false)
  const [mezclas, setMezclas] = useState(0)
  const [cortes, setCortes] = useState(0)
  const [mensaje, setMensaje] = useState(MENSAJE_INICIAL)
  const [preguntaUsuario, setPreguntaUsuario] = useState("")

  // Conversación: array de { role: 'user'|'assistant', content: string }
  const [conversacion, setConversacion] = useState([])
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState("")

  // Cartas con nombre resuelto para el chat y la descarga
  const [cartasConNombre, setCartasConNombre] = useState([])

  useEffect(() => {
    setMazo(crearBaraja())
  }, [])

  const resetTirada = () => {
    setMostrarCartas(false)
    setCartasTirada([null, null, null, null, null])
    setConversacion([])
    setErrorIA("")
    setCartasConNombre([])
  }

  const handleMezclar = () => {
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
    setMensaje(`Mazo mezclado ${mezclas + 1} veces`)
    resetTirada()
  }

  const handleCortar = () => {
    if (cortes >= 1 || mezclas === 0) return
    const posicion = Math.floor(Math.random() * (mazo.length - 10)) + 5
    setMazo((prev) => cortarMazo(prev, posicion))
    setCortes((prev) => prev + 1)
    setMensaje(`Mazo cortado ${cortes + 1}/1 vez`)
    resetTirada()
  }

  const handleTirar = () => {
    if (mezclas < 1 || cortes !== 1) {
      setMensaje("Por favor, mezcla las cartas al menos una vez y córtalas 1 vez.")
      return
    }
    const nuevasCartas = mazo.slice(0, 5).map((card) => ({
      ...card,
      isReversed: Math.random() < 0.5,
    }))
    setCartasTirada(nuevasCartas)
    setMostrarCartas(true)
    setMensaje("¡Tirada realizada! Pedí la interpretación con IA cuando quieras.")
    setConversacion([])
    setErrorIA("")

    const conNombre = nuevasCartas.map((carta, i) => ({
      ...carta,
      nombreCarta: `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`,
      posicion: POSICIONES[i],
    }))
    setCartasConNombre(conNombre)
  }

  const enviarMensaje = async (textoUsuario, esInicial = false) => {
    if (cartasTirada.some((c) => c === null)) return

    const cartasContexto = buildCartasContexto(cartasTirada)

    // Primer mensaje: incluye la pregunta del consultante si la hay
    let contenidoUsuario = textoUsuario
    if (esInicial && preguntaUsuario.trim()) {
      contenidoUsuario = `${textoUsuario}\n\nMi pregunta: ${preguntaUsuario.trim()}`
    }

    const nuevoMensajeUsuario = { role: "user", content: contenidoUsuario }
    const historialActualizado = [...conversacion, nuevoMensajeUsuario]

    setConversacion(historialActualizado)
    setCargandoIA(true)
    setErrorIA("")

    try {
      const res = await fetch("/api/interpretacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajes: historialActualizado,
          cartasContexto,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorIA(data.error || "Error al obtener la interpretación")
      } else {
        setConversacion((prev) => [
          ...prev,
          { role: "assistant", content: data.respuesta },
        ])
      }
    } catch {
      setErrorIA("No se pudo conectar con el servicio de IA. Verificá tu conexión.")
    } finally {
      setCargandoIA(false)
    }
  }

  const handleInterpretar = () => {
    if (!mostrarCartas || cargandoIA) return
    enviarMensaje("Realizá la interpretación completa de esta tirada en cruz.", true)
  }

  const handleSeguimiento = (texto) => {
    enviarMensaje(texto)
  }

  const handleReiniciar = () => {
    setMazo(crearBaraja())
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCortes(0)
    setMensaje(MENSAJE_INICIAL)
    setPreguntaUsuario("")
    setConversacion([])
    setErrorIA("")
    setCartasConNombre([])
  }

  const puedeCortar = mezclas > 0 && cortes < 1
  const puedeRealizar = mezclas >= 1 && cortes === 1
  const puedeInterpretar = mostrarCartas && !cargandoIA && conversacion.length === 0

  return (
    <div className="text-center mb-8">
      <p className="text-amber-700 mb-6 text-lg font-medium">{mensaje}</p>

      <PreguntaInput value={preguntaUsuario} onChange={setPreguntaUsuario} />

      <Controls
        onMezclar={handleMezclar}
        onCortar={handleCortar}
        onTirar={handleTirar}
        onInterpretar={handleInterpretar}
        onReiniciar={handleReiniciar}
        mezclas={mezclas}
        cortes={cortes}
        puedeCortar={puedeCortar}
        puedeRealizar={puedeRealizar}
        puedeInterpretar={puedeInterpretar}
        cargandoIA={cargandoIA}
      />

      <CruzLayout cartasTirada={cartasTirada} mostrar={mostrarCartas} />

      <EstadoMazo totalCartas={mazo.length} mezclas={mezclas} cortes={cortes} />

      <ChatLectura
        mensajes={conversacion}
        cargando={cargandoIA}
        error={errorIA}
        cartasTirada={cartasConNombre}
        onEnviar={handleSeguimiento}
      />
    </div>
  )
}
