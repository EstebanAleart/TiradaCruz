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
import InterpretacionPanel from "@/components/shared/InterpretacionPanel"
import PreguntaInput from "@/components/shared/PreguntaInput"

const MENSAJE_INICIAL = "Mezcla las cartas, luego córtalas 1 vez para poder realizar la tirada"

export default function TiradaEspanola() {
  const [mazo, setMazo] = useState([])
  const [cartasTirada, setCartasTirada] = useState([null, null, null, null, null])
  const [mostrarCartas, setMostrarCartas] = useState(false)
  const [mezclas, setMezclas] = useState(0)
  const [cortes, setCortes] = useState(0)
  const [mensaje, setMensaje] = useState(MENSAJE_INICIAL)
  const [preguntaUsuario, setPreguntaUsuario] = useState("")
  const [interpretacion, setInterpretacion] = useState("")
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState("")

  useEffect(() => {
    setMazo(crearBaraja())
  }, [])

  const resetTirada = () => {
    setMostrarCartas(false)
    setCartasTirada([null, null, null, null, null])
    setInterpretacion("")
    setErrorIA("")
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
    setInterpretacion("")
    setErrorIA("")
  }

  const handleInterpretar = async () => {
    if (!mostrarCartas || cartasTirada.some((c) => c === null)) return

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

  const handleReiniciar = () => {
    setMazo(crearBaraja())
    setCartasTirada([null, null, null, null, null])
    setMostrarCartas(false)
    setMezclas(0)
    setCortes(0)
    setMensaje(MENSAJE_INICIAL)
    setPreguntaUsuario("")
    setInterpretacion("")
    setErrorIA("")
  }

  const puedeCortar = mezclas > 0 && cortes < 1
  const puedeRealizar = mezclas >= 1 && cortes === 1
  const puedeInterpretar = mostrarCartas && !cargandoIA

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

      <InterpretacionPanel
        cargando={cargandoIA}
        error={errorIA}
        interpretacion={interpretacion}
      />
    </div>
  )
}
