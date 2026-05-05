"use client"

import { useState, useEffect } from "react"
import { crearBarajaTarot, mezclarArray, cortarTresMontones, buildCartasContextoTarot, POSICIONES } from "@/lib/tarot"
import CruzLayoutTarot from "@/components/tarot/CruzLayoutTarot"
import CorteTresMontones from "@/components/tarot/CorteTresMontones"
import ChatLectura from "@/components/espanolas/ChatLectura"
import { guardarTirada } from "@/lib/historial"
import { Shuffle, Sparkles, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react"

const MAX_MEZCLAS = 7

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
                border: `1px solid ${i === 0 ? "rgba(167,139,250,0.45)" : "rgba(167,139,250,0.1)"}`,
                background: i === 0
                  ? "linear-gradient(135deg,#1e1b4b 0%,#3730a3 50%,#1e1b4b 100%)"
                  : "linear-gradient(135deg,#0f0e23 0%,#1e1b4b 100%)",
                animationDelay: `${i * 30}ms`,
              }}
            >
              {i === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shuffle className={`w-9 h-9 transition-colors duration-300 ${animando ? "text-purple-400/70" : "text-purple-900/50 group-hover:text-purple-700/60"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </button>
      <div className="text-center">
        {mezclas === 0 ? (
          <p className="text-purple-300 text-base font-medium">Tocá el mazo para mezclar</p>
        ) : (
          <>
            <p className="text-purple-200 font-semibold">{mezclas === 1 ? "Mezclado 1 vez" : `Mezclado ${mezclas} veces`}</p>
            <p className="text-slate-500 text-xs mt-0.5">{mezclas >= MAX_MEZCLAS ? "Máximo alcanzado" : "Seguí mezclando o continuá"}</p>
          </>
        )}
      </div>
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
        <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === idx ? 24 : 8, height: 8, background: i < idx ? "#7c3aed" : i === idx ? "#a78bfa" : "#1e293b" }} />
      ))}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function TiradaTarot({ modo }) {
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

  useEffect(() => { setMazo(crearBarajaTarot(modo)) }, [modo])

  const puedeMezclar = mezclas < MAX_MEZCLAS

  const handleMezclar = () => {
    if (!puedeMezclar) return
    setMazo((prev) => mezclarArray(prev))
    setMezclas((prev) => prev + 1)
  }

  const handleCortar = (orden) => {
    const mazoCortado = cortarTresMontones(mazo, orden)
    const nuevasCartas = mazoCortado.slice(0, 5).map((card) => ({ ...card, isReversed: Math.random() < 0.5 }))
    setMazo(mazoCortado)
    setCartasTirada(nuevasCartas)
    setCartasConNombre(nuevasCartas.map((carta, i) => ({ ...carta, nombreCarta: carta.name, posicion: POSICIONES[i] })))
    setEtapa("lectura")
  }

  const enviarMensaje = async (texto, esInicial = false, displayTexto = undefined) => {
    const cartasContexto = buildCartasContextoTarot(cartasTirada)
    const contenido = esInicial && preguntaUsuario.trim() ? `${texto}\n\nMi pregunta: ${preguntaUsuario.trim()}` : texto
    const msg = { role: "user", content: contenido, ...(displayTexto !== undefined && { displayContent: displayTexto }) }
    const histo = [...conversacion, msg]
    setConversacion(histo)
    setCargandoIA(true)
    setErrorIA("")
    try {
      const res = await fetch("/api/interpretacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajes: histo, cartasContexto, tipoLectura: modo === "mayores" ? "tarot_mayores" : "tarot_completo" }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorIA(data.error || "Error al obtener la interpretación")
      } else {
        setConversacion((prev) => [...prev, { role: "assistant", content: data.respuesta }])
        if (!tiradaYaInterpretada) guardarTirada({ pregunta: preguntaUsuario?.trim() || null, cartas: cartasConNombre, resumen: data.respuesta, modo: modo === "mayores" ? "tarot_mayores" : "tarot_completo" })
        setTiradaYaInterpretada(true)
      }
    } catch {
      setErrorIA("No se pudo conectar con el servicio de IA.")
    } finally {
      setCargandoIA(false)
    }
  }

  const handleInterpretar = (preguntaOverride = null) => {
    const prompt = modoContin ? "Acabo de hacer una nueva tirada de tarot. Interpretá ÚNICAMENTE estas cartas." : "Realizá la interpretación completa de esta tirada de tarot en cruz."
    const display = preguntaOverride ?? (preguntaUsuario.trim() || null)
    enviarMensaje(prompt, !modoContin, display)
  }

  const handleReiniciar = () => {
    setMazo(crearBarajaTarot(modo)); setCartasTirada([null, null, null, null, null]); setEtapa("pregunta")
    setMezclas(0); setPreguntaUsuario(""); setConversacion([]); setErrorIA("")
    setCartasConNombre([]); setTiradaYaInterpretada(false); setModoContin(false)
  }

  const handleContinuar = () => {
    setMazo(crearBarajaTarot(modo)); setCartasTirada([null, null, null, null, null]); setEtapa("mezcla")
    setMezclas(0); setErrorIA(""); setCartasConNombre([]); setTiradaYaInterpretada(false); setModoContin(true)
  }

  const modoLabel = modo === "mayores" ? "Arcanos Mayores" : "78 Cartas"
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
                <p className="text-purple-600/60 text-xs tracking-widest uppercase mb-3">Tarot · {modoLabel}</p>
                <h2 className="text-white text-2xl font-bold leading-snug">¿Qué querés consultar?</h2>
                <p className="text-slate-500 text-sm mt-2">Pensalo mientras mezclás las cartas</p>
              </div>
              <textarea rows={4} value={preguntaUsuario} onChange={(e) => setPreguntaUsuario(e.target.value)} placeholder="Ej: ¿Qué me dicen las cartas sobre mi relación?" className="w-full bg-slate-900 rounded-2xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none resize-none" style={{ border: "1px solid rgba(255,255,255,0.07)" }} />
              <div className="flex flex-col gap-3 mt-auto">
                <button onClick={() => setEtapa("mezcla")} className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base" style={{ background: "#7c3aed", color: "#fff" }}>
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
                <p className="text-purple-600/60 text-xs tracking-widest uppercase mb-3">Paso 1 de 2</p>
                <h2 className="text-white text-2xl font-bold">Mezclá el mazo</h2>
                {preguntaUsuario.trim() && <p className="text-slate-500 text-sm mt-2 italic">"{preguntaUsuario.trim().slice(0, 50)}{preguntaUsuario.length > 50 ? "…" : ""}"</p>}
              </div>
              <div className="flex-1 flex items-center justify-center py-4">
                <MazoVisual mezclas={mezclas} onMezclar={handleMezclar} />
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => setEtapa("corte")} disabled={mezclas === 0} className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base" style={{ background: mezclas > 0 ? "#7c3aed" : "#0f172a", color: mezclas > 0 ? "#fff" : "#334155", cursor: mezclas === 0 ? "not-allowed" : "pointer" }}>
                  Cortar el mazo
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
                <p className="text-purple-600/60 text-xs tracking-widest uppercase mb-3">Paso 2 de 2</p>
                <h2 className="text-white text-2xl font-bold">Cortá el mazo</h2>
                <p className="text-slate-500 text-sm mt-2">Elegí el orden que más te llame</p>
              </div>
              <div className="flex-1 flex items-center justify-center py-2">
                <CorteTresMontones onCortar={handleCortar} />
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
              <CruzLayoutTarot cartasTirada={cartasTirada} mostrar={true} />
              {!tiradaYaInterpretada && (
                <button onClick={() => handleInterpretar()} disabled={cargandoIA} className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-base disabled:opacity-50" style={{ background: "linear-gradient(135deg,#5b21b6 0%,#7c3aed 100%)", color: "#fff", boxShadow: "0 8px 24px rgba(91,33,182,0.3)" }}>
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
                <button onClick={handleContinuar} disabled={cargandoIA} className="bg-slate-800 hover:bg-slate-700 text-purple-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40">
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
