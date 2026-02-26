"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Send, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function BurbujaMensaje({ mensaje }) {
  const esLectora = mensaje.role === "assistant"
  return (
    <div className={`flex ${esLectora ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
          esLectora
            ? "bg-gradient-to-br from-amber-900 via-red-950 to-purple-950 text-amber-100 rounded-tl-sm"
            : "bg-white/90 text-gray-800 border border-amber-200 rounded-tr-sm"
        }`}
      >
        {mensaje.content}
      </div>
    </div>
  )
}

export default function ChatLectura({
  mensajes,
  cargando,
  error,
  cartasTirada,
  onEnviar,
  esperandoPreguntaNuevaTirada = false,
  onInterpretarConPregunta,
  siempreVisible = false,
}) {
  const [input, setInput] = useState("")
  const messagesRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [mensajes, cargando])

  const handleEnviar = () => {
    const texto = input.trim()
    if (!texto || cargando) return
    if (esperandoPreguntaNuevaTirada) {
      // El input actúa como pregunta de la nueva tirada → dispara interpretación
      onInterpretarConPregunta(texto)
    } else {
      onEnviar(texto)
    }
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const descargarTxt = () => {
    const fecha = new Date().toLocaleString("es-AR")

    const lineasCartas = cartasTirada
      .map((c, i) => {
        const posiciones = ["Presente", "Futuro", "Resultado", "Pasado", "Consejo"]
        const estado = c.isReversed ? "invertida" : "al derecho"
        return `  ${posiciones[i]}: ${c.nombreCarta} (${estado})`
      })
      .join("\n")

    const lineasChat = mensajes
      .map((m) => {
        const quien = m.role === "assistant" ? "LECTORA" : "VOS"
        return `[${quien}]\n${m.content}`
      })
      .join("\n\n---\n\n")

    const contenido = `=== TiradaCruz - Lectura del ${fecha} ===

CARTAS DE LA TIRADA:
${lineasCartas}

===============================

${lineasChat}

===============================
tiradacruz.com
`

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tiradacruz-lectura-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!siempreVisible && mensajes.length === 0 && !cargando && !error && !esperandoPreguntaNuevaTirada) return null

  return (
    <div className="mt-10 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-amber-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-purple-950 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-100 font-semibold">Tu Lectura</span>
          </div>
          {mensajes.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const ultima = [...mensajes].reverse().find((m) => m.role === "assistant")
                  if (!ultima) return
                  const texto = `🔮 Mi tirada de cartas:\n\n${ultima.content.slice(0, 500)}${ultima.content.length > 500 ? "..." : ""}\n\nHacé la tuya en tiradadecartas.com.ar`
                  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank")
                }}
                className="flex items-center gap-1.5 text-green-400 hover:text-green-200 text-sm transition-colors"
                title="Compartir por WhatsApp"
              >
                <WhatsAppIcon />
                Compartir
              </button>
              <button
                onClick={descargarTxt}
                className="flex items-center gap-2 text-amber-300 hover:text-amber-100 text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar .txt
              </button>
            </div>
          )}
        </div>
        <p className="text-amber-500/70 text-xs mt-1">
          Generado por Inteligencia Artificial · Solo con fines recreativos · No reemplaza asesoramiento profesional
        </p>
      </div>

      {/* Mensajes */}
      <div ref={messagesRef} className="bg-amber-950/10 backdrop-blur px-6 py-6 max-h-[520px] overflow-y-auto">
        {mensajes.length === 0 && !cargando && !error && !esperandoPreguntaNuevaTirada && (
          <div className="flex items-center justify-center h-32 text-amber-700/40 text-sm italic select-none">
            Presioná "Interpretar con IA" para comenzar la lectura
          </div>
        )}
        {mensajes
          .filter((m) => !("displayContent" in m) || m.displayContent)
          .map((m, i) => (
            <BurbujaMensaje
              key={i}
              mensaje={"displayContent" in m ? { role: m.role, content: m.displayContent } : m}
            />
          ))}

        {esperandoPreguntaNuevaTirada && (
          <div className="flex justify-start mb-4">
            <div className="bg-amber-800/40 border border-amber-600/50 rounded-2xl rounded-tl-sm px-5 py-4 text-amber-200 text-sm italic max-w-[85%]">
              Nueva tirada lista. Escribí tu pregunta abajo y presioná Enter — o cerrá el chat y usá el botón "Interpretar con IA" para ir directo.
            </div>
          </div>
        )}

        {cargando && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-br from-amber-900 via-red-950 to-purple-950 rounded-2xl rounded-tl-sm px-5 py-4 shadow-md">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm italic">Las cartas hablan...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

      </div>

      {/* Input seguimiento */}
      <div className="bg-white/90 border-t border-amber-200 px-4 py-3 flex gap-3 items-end">
        <textarea
          rows={2}
          className="flex-1 resize-none rounded-xl border border-amber-300 px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          placeholder={
            esperandoPreguntaNuevaTirada
              ? "Escribí tu pregunta para esta nueva tirada y presioná Enter..."
              : "Seguí preguntando sobre tu tirada..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={cargando}
        />
        <Button
          onClick={handleEnviar}
          disabled={!input.trim() || cargando}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 h-auto"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
