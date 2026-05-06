"use client"

import { useState, useEffect } from "react"
import { crearBaraja, mezclarArray, cortarMazo, PALOS_NOMBRES, VALOR_NOMBRES } from "@/lib/baraja"
import CruzLayout from "@/components/shared/CruzLayout"
import ChatLectura from "@/components/espanolas/ChatLectura"
import { guardarTirada } from "@/lib/historial"
import { trackEvento } from "@/lib/eventos"
import { Shuffle, Scissors, Sparkles, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react"

const POSICIONES = ["Presente", "Futuro", "Resultado", "Pasado", "Consejo"]

function buildCartasContexto(cartasTirada) {
  return cartasTirada
    .map((carta, i) => {
      const nombre = `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`
      return `  - ${POSICIONES[i]}: ${nombre} (${carta.isReversed ? "invertida" : "al derecho"})`
    })
    .join("\n")
}

// ─── Mazo tapeable ────────────────────────────────────────────────────────────
function MazoVisual({ mezclas, onMezclar }) {
  const [animando, setAnimando] = useState(false)

  const handleTap = () => {
    if (animando) return
    setAnimando(true)
    onMezclar()
    setTimeout(() => setAnimando(false), 500)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <button onClick={handleTap} className="group focus:outline-none active:scale-95 transition-transform" aria-label="Tocá para mezclar">
        <div className="relative w-28 h-40">
          {[4, 3, 2, 1, 0].map((i) => (
            <div
              key={i}
              className={animando ? "shuffle-anim" : ""}
              style={{
                position: "absolute",
                width: 112, height: 160,
                top: i * 2.5, left: i * 1.5,
                zIndex: 5 - i,
                borderRadius: 14,
                border: `1px solid ${i === 0 ? "rgba(217,119,6,0.5)" : "rgba(217,119,6,0.12)"}`,
                background: i === 0
                  ? "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)"
                  : "linear-gradient(135deg,#0f0e23 0%,#1e1b4b 100%)",
                animationDelay: `${i * 30}ms`,
              }}
            >
              {i === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shuffle className={`w-9 h-9 transition-colors duration-300 ${animando ? "text-amber-500/70" : "text-amber-800/30 group-hover:text-amber-700/50"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </button>
      <div className="text-center">
        {mezclas === 0 ? (
          <p className="text-amber-400 text-base font-medium">Tocá el mazo para mezclar</p>
        ) : (
          <>
            <p className="text-amber-300 font-semibold">{mezclas === 1 ? "Mezclado 1 vez" : `Mezclado ${mezclas} veces`}</p>
            <p className="text-slate-500 text-xs mt-0.5">Seguí mezclando o continuá</p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Corte visual ─────────────────────────────────────────────────────────────
function CortarMazo({ onCortar }) {
  const [cortando, setCortando] = useState(false)

  const handleTap = () => {
    if (cortando) return
    setCortando(true)
    setTimeout(() => onCortar(), 650)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <button onClick={handleTap} disabled={cortando} className="group focus:outline-none active:scale-95 transition-transform disabled:cursor-default" aria-label="Cortar el mazo">
        <div style={{ width: 112, height: 80, borderRadius: "14px 14px 0 0", border: "1px solid rgba(217,119,6,0.4)", background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", transform: cortando ? "translateY(-18px)" : "translateY(0)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          <Scissors className={`w-6 h-6 transition-colors duration-300 ${cortando ? "text-amber-400" : "text-amber-800/40 group-hover:text-amber-600/60"}`} />
        </div>
        <div style={{ width: 112, height: 80, borderRadius: "0 0 14px 14px", border: "1px solid rgba(217,119,6,0.15)", borderTop: "none", background: "linear-gradient(135deg,#0f0e23 0%,#1e1b4b 100%)" }} />
      </button>
      <p className={`text-sm transition-all ${cortando ? "text-amber-400/60 animate-pulse" : "text-amber-400 font-medium"}`}>
        {cortando ? "Cortando..." : "Tocá para cortar"}
      </p>
    </div>
  )
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ etapa }) {
  const pasos = ["pregunta", "mezcla", "corte"]
  const idx = pasos.indexOf(etapa)
  return (
    <div className="flex justify-center gap-2 pt-5 pb-0">
      {pasos.map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === idx ? 24 : 8, height: 8, background: i < idx ? "#d97706" : i === idx ? "#fbbf24" : "#1e293b" }} />
      ))}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TiradaEspanola() {
  const [etapa, setEtapa] = useState("pregunta")
  const [mazo, setMazo] = useState([])
  const [cartasTirada, setCartasTirada] = useState([null, null, null, null, null])
  const [mezclas, setMezclas] = useState(0)
  const [preguntaUsuario, setPreguntaUsuario] = useState("")
  const [conversacion, setConversacion] = useState([])
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState("")
  const [cartasConNombre, setCartasConNombre] = useState([])
  const [tiradaYaInterpretada, setTiradaYaInterpretada] = useState(false)
  const [modoContin, setModoContin] = useState(false)

  useEffect(() => { setMazo(crearBaraja()) }, [])

  const handleMezclar = () => {
    if (mezclas === 0) trackEvento('mezclar_espanola')
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
  }

  const handleCortar = () => {
    trackEvento('cortar_espanola')
    const pos = Math.floor(Math.random() * (mazo.length - 10)) + 5
    const mazoCortado = cortarMazo(mazo, pos)
    const nuevasCartas = mazoCortado.slice(0, 5).map((card) => ({ ...card, isReversed: Math.random() < 0.5 }))
    setMazo(mazoCortado)
    setCartasTirada(nuevasCartas)
    setCartasConNombre(nuevasCartas.map((carta, i) => ({ ...carta, nombreCarta: `${VALOR_NOMBRES[carta.valor]} de ${PALOS_NOMBRES[carta.palo]}`, posicion: POSICIONES[i] })))
    setEtapa("lectura")
  }

  const enviarMensaje = async (texto, esInicial = false, displayTexto = undefined) => {
    const cartasContexto = buildCartasContexto(cartasTirada)
    const contenido = esInicial && preguntaUsuario.trim() ? `${texto}\n\nMi pregunta: ${preguntaUsuario.trim()}` : texto
    const msg = { role: "user", content: contenido, ...(displayTexto !== undefined && { displayContent: displayTexto }) }
    const histo = [...conversacion, msg]
    setConversacion(histo)
    setCargandoIA(true)
    setErrorIA("")
    try {
      const res = await fetch("/api/interpretacion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensajes: histo, cartasContexto }) })
      const data = await res.json()
      if (!res.ok) {
        setErrorIA(data.error || "Error al obtener la interpretación")
      } else {
        setConversacion((prev) => [...prev, { role: "assistant", content: data.respuesta }])
        if (!tiradaYaInterpretada) guardarTirada({ pregunta: preguntaUsuario?.trim() || null, cartas: cartasConNombre, resumen: data.respuesta, modo: "espanolas" })
        setTiradaYaInterpretada(true)
      }
    } catch {
      setErrorIA("No se pudo conectar con el servicio de IA.")
    } finally {
      setCargandoIA(false)
    }
  }

  const handleInterpretar = (preguntaOverride = null) => {
    trackEvento('interpretar_espanola')
    const prompt = modoContin ? "Acabo de hacer una nueva tirada. Interpretá ÚNICAMENTE estas cartas." : "Realizá la interpretación completa de esta tirada en cruz."
    const display = preguntaOverride ?? (preguntaUsuario.trim() || null)
    enviarMensaje(prompt, !modoContin, display)
  }

  const handleReiniciar = () => {
    setMazo(crearBaraja()); setCartasTirada([null, null, null, null, null]); setEtapa("pregunta")
    setMezclas(0); setPreguntaUsuario(""); setConversacion([]); setErrorIA("")
    setCartasConNombre([]); setTiradaYaInterpretada(false); setModoContin(false)
  }

  const handleContinuar = () => {
    setMazo(crearBaraja()); setCartasTirada([null, null, null, null, null]); setEtapa("mezcla")
    setMezclas(0); setErrorIA(""); setCartasConNombre([]); setTiradaYaInterpretada(false); setModoContin(true)
  }

  const sep = { borderTop: "1px solid rgba(255,255,255,0.05)" }
  const card = { border: "1px solid rgba(255,255,255,0.05)" }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl" style={card}>

        {/* PREGUNTA */}
        {etapa === "pregunta" && (
          <div className="flex flex-col" style={{ minHeight: 500 }}>
            <ProgressDots etapa="pregunta" />
            <div className="p-6 flex flex-col gap-6 flex-1">
              <div className="text-center pt-2">
                <p className="text-amber-700/60 text-xs tracking-widest uppercase mb-3">Baraja Española · Cruz</p>
                <h2 className="text-white text-2xl font-bold leading-snug">¿Qué querés consultar?</h2>
                <p className="text-slate-500 text-sm mt-2">Pensalo mientras mezclás las cartas</p>
              </div>
              <textarea rows={4} value={preguntaUsuario} onChange={(e) => setPreguntaUsuario(e.target.value)} placeholder="Ej: ¿Cómo va a evolucionar mi situación laboral?" className="w-full bg-slate-900 rounded-2xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none resize-none" style={{ border: "1px solid rgba(255,255,255,0.07)" }} />
              <div className="flex flex-col gap-3 mt-auto">
                <button onClick={() => setEtapa("mezcla")} className="w-full bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base">
                  Empezar <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => { setPreguntaUsuario(""); setEtapa("mezcla") }} className="text-slate-600 hover:text-slate-400 text-sm py-2 transition-colors">
                  Sin pregunta, ir directo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MEZCLA */}
        {etapa === "mezcla" && (
          <div className="flex flex-col" style={{ minHeight: 500 }}>
            <ProgressDots etapa="mezcla" />
            <div className="p-6 flex flex-col gap-6 flex-1">
              <div className="text-center pt-2">
                <p className="text-amber-700/60 text-xs tracking-widest uppercase mb-3">Paso 1 de 2</p>
                <h2 className="text-white text-2xl font-bold">Mezclá el mazo</h2>
                {preguntaUsuario.trim() && <p className="text-slate-500 text-sm mt-2 italic">"{preguntaUsuario.trim().slice(0, 50)}{preguntaUsuario.length > 50 ? "…" : ""}"</p>}
              </div>
              <div className="flex-1 flex items-center justify-center py-4">
                <MazoVisual mezclas={mezclas} onMezclar={handleMezclar} />
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => setEtapa("corte")} disabled={mezclas === 0} className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base" style={{ background: mezclas > 0 ? "#d97706" : "#0f172a", color: mezclas > 0 ? "#000" : "#334155", cursor: mezclas === 0 ? "not-allowed" : "pointer" }}>
                  <Scissors className="w-5 h-5" /> Cortar el mazo
                </button>
                <button onClick={() => setEtapa("pregunta")} className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-400 text-sm py-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Volver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CORTE */}
        {etapa === "corte" && (
          <div className="flex flex-col" style={{ minHeight: 500 }}>
            <ProgressDots etapa="corte" />
            <div className="p-6 flex flex-col gap-6 flex-1">
              <div className="text-center pt-2">
                <p className="text-amber-700/60 text-xs tracking-widest uppercase mb-3">Paso 2 de 2</p>
                <h2 className="text-white text-2xl font-bold">Cortá el mazo</h2>
                <p className="text-slate-500 text-sm mt-2">Una sola vez, con la mano izquierda</p>
              </div>
              <div className="flex-1 flex items-center justify-center py-4">
                <CortarMazo onCortar={handleCortar} />
              </div>
              <button onClick={() => setEtapa("mezcla")} className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-400 text-sm py-3 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver a mezclar
              </button>
            </div>
          </div>
        )}

        {/* LECTURA */}
        {etapa === "lectura" && (
          <div className="flex flex-col">
            <div className="p-6 flex flex-col items-center gap-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <CruzLayout cartasTirada={cartasTirada} mostrar={true} />
              {!tiradaYaInterpretada && (
                <button onClick={() => handleInterpretar()} disabled={cargandoIA} className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base disabled:opacity-50" style={{ background: "linear-gradient(135deg,#b45309 0%,#d97706 100%)", color: "#000", boxShadow: "0 8px 24px rgba(180,83,9,0.25)" }}>
                  <Sparkles className="w-5 h-5" />
                  {cargandoIA ? "Interpretando..." : "Interpretar con IA"}
                </button>
              )}
            </div>

            <ChatLectura
              mensajes={conversacion}
              cargando={cargandoIA}
              error={errorIA}
              cartasTirada={cartasConNombre}
              onEnviar={(texto) => enviarMensaje(texto)}
              esperandoPreguntaNuevaTirada={modoContin && !tiradaYaInterpretada}
              onInterpretarConPregunta={handleInterpretar}
              siempreVisible={tiradaYaInterpretada}
              className=""
            />

            <div className="px-6 py-4 flex items-center justify-between" style={sep}>
              {conversacion.length > 0 ? (
                <button onClick={handleContinuar} disabled={cargandoIA} className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40">
                  Nueva tirada
                </button>
              ) : <div />}
              <button onClick={handleReiniciar} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 text-sm transition-colors">
                <RotateCcw className="w-4 h-4" /> Reiniciar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
