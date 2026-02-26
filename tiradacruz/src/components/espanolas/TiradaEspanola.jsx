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
import { guardarTirada } from "@/lib/historial"

const MENSAJE_INICIAL = "Mezcla las cartas, luego córtalas 1 vez para poder realizar la tirada"
const POSICIONES = ["Presente", "Futuro", "Resultado", "Pasado", "Consejo"]

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
  const [conversacion, setConversacion] = useState([])
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState("")
  const [cartasConNombre, setCartasConNombre] = useState([])
  const [modoContin, setModoContin] = useState(false)
  const [tiradaYaInterpretada, setTiradaYaInterpretada] = useState(false)

  useEffect(() => {
    setMazo(crearBaraja())
  }, [])

  // Solo resetea el estado visual de la tirada — NO toca la conversación ni modoContin
  const resetVisual = () => {
    setMostrarCartas(false)
    setCartasTirada([null, null, null, null, null])
    setErrorIA("")
    setCartasConNombre([])
    setTiradaYaInterpretada(false)
  }

  const handleMezclar = () => {
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
    setMensaje(modoContin ? "Mezclando nueva tirada..." : `Mazo mezclado ${mezclas + 1} veces`)
    resetVisual()
  }

  const handleCortar = () => {
    if (cortes >= 1 || mezclas === 0) return
    const posicion = Math.floor(Math.random() * (mazo.length - 10)) + 5
    setMazo((prev) => cortarMazo(prev, posicion))
    setCortes((prev) => prev + 1)
    setMensaje(modoContin ? "Mazo cortado. Realizá la tirada." : `Mazo cortado ${cortes + 1}/1 vez`)
    resetVisual()
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
    setTiradaYaInterpretada(false)
    setMensaje(
      modoContin
        ? "Nueva tirada lista. Escribí tu pregunta en el chat o interpretá directamente."
        : "¡Tirada realizada! Pedí la interpretación con IA cuando quieras."
    )
    setErrorIA("")
    setCartasConNombre(
      nuevasCartas.map((carta, i) => ({
        ...carta,
        nombreCarta: `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`,
        posicion: POSICIONES[i],
      }))
    )
  }

  const enviarMensaje = async (textoUsuario, esInicial = false, preguntaOverride = null, displayTexto = undefined) => {
    if (cartasTirada.some((c) => c === null)) return

    const cartasContexto = buildCartasContexto(cartasTirada)
    const pregunta = preguntaOverride !== null ? preguntaOverride : preguntaUsuario

    let contenidoUsuario = textoUsuario
    if (esInicial && pregunta.trim()) {
      contenidoUsuario = `${textoUsuario}\n\nMi pregunta: ${pregunta.trim()}`
    }

    // displayTexto: lo que se muestra en el chat (null = oculto, undefined = usa content)
    const nuevoMensajeUsuario = {
      role: "user",
      content: contenidoUsuario,
      ...(displayTexto !== undefined && { displayContent: displayTexto }),
    }
    const historialActualizado = [...conversacion, nuevoMensajeUsuario]

    setConversacion(historialActualizado)
    setCargandoIA(true)
    setErrorIA("")

    try {
      const res = await fetch("/api/interpretacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajes: historialActualizado, cartasContexto }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorIA(data.error || "Error al obtener la interpretación")
      } else {
        setConversacion((prev) => [...prev, { role: "assistant", content: data.respuesta }])
        if (!tiradaYaInterpretada) {
          guardarTirada({
            pregunta: pregunta?.trim() || null,
            cartas: cartasConNombre,
            resumen: data.respuesta,
            modo: "espanolas",
          })
        }
        setTiradaYaInterpretada(true)
      }
    } catch {
      setErrorIA("No se pudo conectar con el servicio de IA. Verificá tu conexión.")
    } finally {
      setCargandoIA(false)
    }
  }

  const handleInterpretar = (preguntaOverride = null) => {
    if (!mostrarCartas || cargandoIA || tiradaYaInterpretada) return
    const prompt = modoContin
      ? "Acabo de hacer una nueva tirada. Interpretá ÚNICAMENTE las cartas que están en el contexto de esta sesión. No uses cartas de tiradas anteriores ni inventes ninguna."
      : "Realizá la interpretación completa de esta tirada en cruz."
    // displayTexto: muestra la pregunta del usuario en el chat (o null si no hay, para ocultar el prompt interno)
    const preguntaDisplay = (modoContin ? preguntaOverride : preguntaUsuario)?.trim() || null
    enviarMensaje(prompt, !modoContin, preguntaOverride, preguntaDisplay)
  }

  const handleContinuar = () => {
    setMazo(crearBaraja())
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCortes(0)
    setPreguntaUsuario("")
    setErrorIA("")
    setCartasConNombre([])
    setTiradaYaInterpretada(false)
    setModoContin(true)
    setMensaje("Nueva tirada — mezcla y cortá para continuar la sesión")
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
    setModoContin(false)
    setTiradaYaInterpretada(false)
  }

  const puedeCortar = mezclas > 0 && cortes < 1
  const puedeRealizar = mezclas >= 1 && cortes === 1
  const puedeInterpretar = mostrarCartas && !cargandoIA && !tiradaYaInterpretada
  const esperandoPreguntaNuevaTirada = modoContin && mostrarCartas && !tiradaYaInterpretada
  const sesionActiva = conversacion.length > 0 || cargandoIA

  return (
    <div className="mb-8">
      {/* Mensaje de estado — se oculta una vez que la sesión está activa */}
      {!sesionActiva && (
        <p className="text-amber-700 mb-6 text-lg font-medium text-center">{mensaje}</p>
      )}

      <Controls
        onMezclar={handleMezclar}
        onCortar={handleCortar}
        onTirar={handleTirar}
        onInterpretar={() => handleInterpretar()}
        onContinuar={handleContinuar}
        onReiniciar={handleReiniciar}
        mezclas={mezclas}
        cortes={cortes}
        puedeCortar={puedeCortar}
        puedeRealizar={puedeRealizar}
        puedeInterpretar={puedeInterpretar}
        cargandoIA={cargandoIA}
        hayConversacion={conversacion.length > 0}
      />

      {mostrarCartas ? (
        // Grid 2 columnas: siempre activo cuando las cartas están reveladas
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
          {/* Columna izquierda: pregunta + cartas */}
          <div className="min-w-0">
            {!modoContin && !tiradaYaInterpretada && (
              <PreguntaInput value={preguntaUsuario} onChange={setPreguntaUsuario} />
            )}
            <CruzLayout cartasTirada={cartasTirada} mostrar={true} />
            <EstadoMazo totalCartas={mazo.length} mezclas={mezclas} cortes={cortes} />
          </div>

          {/* Columna derecha: chat SIEMPRE visible */}
          <div className="lg:sticky lg:top-4 min-w-0">
            <ChatLectura
              mensajes={conversacion}
              cargando={cargandoIA}
              error={errorIA}
              cartasTirada={cartasConNombre}
              onEnviar={(texto) => enviarMensaje(texto)}
              esperandoPreguntaNuevaTirada={esperandoPreguntaNuevaTirada}
              onInterpretarConPregunta={(pregunta) => handleInterpretar(pregunta)}
              siempreVisible
            />
          </div>
        </div>
      ) : (
        // Layout apilado antes de revelar cartas
        <>
          {!modoContin && (
            <PreguntaInput value={preguntaUsuario} onChange={setPreguntaUsuario} />
          )}
          <CruzLayout cartasTirada={cartasTirada} mostrar={false} />
          <EstadoMazo totalCartas={mazo.length} mezclas={mezclas} cortes={cortes} />
          {modoContin && conversacion.length > 0 && (
            <div className="mt-6">
              <ChatLectura
                mensajes={conversacion}
                cargando={cargandoIA}
                error={errorIA}
                cartasTirada={cartasConNombre}
                onEnviar={(texto) => enviarMensaje(texto)}
                esperandoPreguntaNuevaTirada={false}
                onInterpretarConPregunta={() => {}}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
