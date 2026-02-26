"use client"

import { useState, useEffect } from "react"
import {
  crearBarajaTarot,
  mezclarArray,
  cortarTresMontones,
  buildCartasContextoTarot,
  POSICIONES,
} from "@/lib/tarot"
import ControlsTarot from "@/components/tarot/ControlsTarot"
import CruzLayoutTarot from "@/components/tarot/CruzLayoutTarot"
import CorteTresMontones from "@/components/tarot/CorteTresMontones"
import ChatLectura from "@/components/espanolas/ChatLectura"
import PreguntaInput from "@/components/shared/PreguntaInput"
import { guardarTirada } from "@/lib/historial"

const MENSAJE_INICIAL = "Mezcla las cartas y luego realizá el corte en tres montones"
const MAX_MEZCLAS = 7

// prop modo: "mayores" | "completo"
export default function TiradaTarot({ modo }) {
  const [mazo, setMazo] = useState([])
  const [cartasTirada, setCartasTirada] = useState([null, null, null, null, null])
  const [mostrarCartas, setMostrarCartas] = useState(false)
  const [mezclas, setMezclas] = useState(0)
  const [corteRealizado, setCorteRealizado] = useState(false)
  const [mensaje, setMensaje] = useState(MENSAJE_INICIAL)
  const [preguntaUsuario, setPreguntaUsuario] = useState("")
  const [conversacion, setConversacion] = useState([])
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState("")
  const [cartasConNombre, setCartasConNombre] = useState([])
  const [modoContin, setModoContin] = useState(false)
  const [tiradaYaInterpretada, setTiradaYaInterpretada] = useState(false)

  useEffect(() => {
    setMazo(crearBarajaTarot(modo))
  }, [modo])

  // Solo resetea el estado visual — NO toca conversacion ni modoContin
  const resetVisual = () => {
    setMostrarCartas(false)
    setCartasTirada([null, null, null, null, null])
    setCorteRealizado(false)
    setErrorIA("")
    setCartasConNombre([])
    setTiradaYaInterpretada(false)
  }

  const handleMezclar = () => {
    if (corteRealizado || mezclas >= MAX_MEZCLAS) return
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
    const nuevasMezclas = mezclas + 1
    setMensaje(
      modoContin
        ? `Mezclando nueva tirada... (${nuevasMezclas}/${MAX_MEZCLAS})`
        : nuevasMezclas >= MAX_MEZCLAS
        ? "Mazo mezclado 7 veces. Realizá el corte."
        : `Mazo mezclado ${nuevasMezclas}/${MAX_MEZCLAS} — podés seguir mezclando o hacer el corte.`
    )
    resetVisual()
  }

  // Recibe el orden de los 3 montones elegido por el usuario
  const handleCortar = (orden) => {
    setMazo((prev) => cortarTresMontones(prev, orden))
    setCorteRealizado(true)
    setMensaje(modoContin ? "Corte realizado. Realizá la tirada." : "Corte listo. ¡Realizá la tirada!")
  }

  const handleTirar = () => {
    if (mezclas < 1 || !corteRealizado) {
      setMensaje("Mezclá las cartas y hacé el corte primero.")
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
        : "¡Tirada realizada! Pedí la interpretación cuando quieras."
    )
    setErrorIA("")
    setCartasConNombre(
      nuevasCartas.map((carta, i) => ({
        ...carta,
        nombreCarta: carta.name,
        posicion: POSICIONES[i],
      }))
    )
  }

  const enviarMensaje = async (textoUsuario, esInicial = false, preguntaOverride = null, displayTexto = undefined) => {
    if (cartasTirada.some((c) => c === null)) return

    const cartasContexto = buildCartasContextoTarot(cartasTirada)
    const pregunta = preguntaOverride !== null ? preguntaOverride : preguntaUsuario

    let contenidoUsuario = textoUsuario
    if (esInicial && pregunta.trim()) {
      contenidoUsuario = `${textoUsuario}\n\nMi pregunta: ${pregunta.trim()}`
    }

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
        body: JSON.stringify({
          mensajes: historialActualizado,
          cartasContexto,
          tipoLectura: modo === "mayores" ? "tarot_mayores" : "tarot_completo",
        }),
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
            modo: modo === "mayores" ? "tarot_mayores" : "tarot_completo",
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
      ? "Acabo de hacer una nueva tirada de tarot. Interpretá ÚNICAMENTE las cartas que están en el contexto de esta sesión. No uses cartas de tiradas anteriores ni inventes ninguna."
      : "Realizá la interpretación completa de esta tirada de tarot en cruz."
    const preguntaDisplay = (modoContin ? preguntaOverride : preguntaUsuario)?.trim() || null
    enviarMensaje(prompt, !modoContin, preguntaOverride, preguntaDisplay)
  }

  const handleContinuar = () => {
    setMazo(crearBarajaTarot(modo))
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCorteRealizado(false)
    setPreguntaUsuario("")
    setErrorIA("")
    setCartasConNombre([])
    setTiradaYaInterpretada(false)
    setModoContin(true)
    setMensaje("Nueva tirada — mezcla y cortá para continuar la sesión")
  }

  const handleReiniciar = () => {
    setMazo(crearBarajaTarot(modo))
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCorteRealizado(false)
    setMensaje(MENSAJE_INICIAL)
    setPreguntaUsuario("")
    setConversacion([])
    setErrorIA("")
    setCartasConNombre([])
    setModoContin(false)
    setTiradaYaInterpretada(false)
  }

  const puedeMezclar = !corteRealizado && mezclas < MAX_MEZCLAS
  const puedeCortar = mezclas >= 1 && !corteRealizado
  const puedeRealizar = mezclas >= 1 && corteRealizado
  const puedeInterpretar = mostrarCartas && !cargandoIA && !tiradaYaInterpretada
  const esperandoPreguntaNuevaTirada = modoContin && mostrarCartas && !tiradaYaInterpretada
  const sesionActiva = conversacion.length > 0 || cargandoIA

  return (
    <div className="mb-8">
      {!sesionActiva && (
        <p className="text-amber-700 mb-6 text-lg font-medium text-center">{mensaje}</p>
      )}

      <ControlsTarot
        onMezclar={handleMezclar}
        onTirar={handleTirar}
        onInterpretar={() => handleInterpretar()}
        onContinuar={handleContinuar}
        onReiniciar={handleReiniciar}
        mezclas={mezclas}
        maxMezclas={MAX_MEZCLAS}
        puedeMezclar={puedeMezclar}
        puedeRealizar={puedeRealizar}
        puedeInterpretar={puedeInterpretar}
        cargandoIA={cargandoIA}
        hayConversacion={conversacion.length > 0}
      />

      {/* Corte en 3 montones — aparece cuando se mezcló pero no se cortó */}
      {puedeCortar && (
        <CorteTresMontones onCortar={handleCortar} />
      )}

      {mostrarCartas ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
          {/* Columna izquierda: pregunta + cartas */}
          <div className="min-w-0">
            {!modoContin && !tiradaYaInterpretada && (
              <PreguntaInput value={preguntaUsuario} onChange={setPreguntaUsuario} />
            )}
            <CruzLayoutTarot cartasTirada={cartasTirada} mostrar={true} />
          </div>

          {/* Columna derecha: chat siempre visible */}
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
        <>
          {!modoContin && (
            <PreguntaInput value={preguntaUsuario} onChange={setPreguntaUsuario} />
          )}
          <CruzLayoutTarot cartasTirada={cartasTirada} mostrar={false} />
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
