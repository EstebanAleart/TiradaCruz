"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Send, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

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
}) {
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, cargando])

  const handleEnviar = () => {
    const texto = input.trim()
    if (!texto || cargando) return
    onEnviar(texto)
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

  if (mensajes.length === 0 && !cargando && !error) return null

  return (
    <div className="mt-10 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-amber-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-purple-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-amber-100 font-semibold">Tu Lectura</span>
        </div>
        {mensajes.length > 0 && (
          <button
            onClick={descargarTxt}
            className="flex items-center gap-2 text-amber-300 hover:text-amber-100 text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar .txt
          </button>
        )}
      </div>

      {/* Mensajes */}
      <div className="bg-amber-950/10 backdrop-blur px-6 py-6 max-h-[520px] overflow-y-auto">
        {mensajes.map((m, i) => (
          <BurbujaMensaje key={i} mensaje={m} />
        ))}

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

        <div ref={bottomRef} />
      </div>

      {/* Input seguimiento */}
      <div className="bg-white/90 border-t border-amber-200 px-4 py-3 flex gap-3 items-end">
        <textarea
          rows={2}
          className="flex-1 resize-none rounded-xl border border-amber-300 px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          placeholder="Seguí preguntando sobre tu tirada..."
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
