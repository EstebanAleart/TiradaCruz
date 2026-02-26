"use client"

import { Shuffle, Scissors, LayoutGrid, Sparkles, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ControlsTarot({
  onMezclar,
  onTirar,
  onInterpretar,
  onContinuar,
  onReiniciar,
  mezclas,
  maxMezclas,
  puedeMezclar,
  puedeRealizar,
  puedeInterpretar,
  cargandoIA,
  hayConversacion,
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {/* Mezclar — bloqueado después del corte o al llegar a 7 */}
      <Button
        onClick={onMezclar}
        disabled={!puedeMezclar || cargandoIA}
        variant="outline"
        className="border-amber-400 text-amber-800 hover:bg-amber-50 gap-2 disabled:opacity-40"
      >
        <Shuffle className="w-4 h-4" />
        {mezclas === 0 ? "Mezclar" : `Mezclar (${mezclas}/${maxMezclas})`}
      </Button>

      {/* Tirar — disponible solo una vez cortado */}
      <Button
        onClick={onTirar}
        disabled={!puedeRealizar || cargandoIA}
        variant="outline"
        className="border-amber-400 text-amber-800 hover:bg-amber-50 gap-2 disabled:opacity-40"
      >
        <LayoutGrid className="w-4 h-4" />
        Realizar tirada
      </Button>

      {/* Interpretar con IA */}
      <Button
        onClick={onInterpretar}
        disabled={!puedeInterpretar || cargandoIA}
        className="bg-purple-700 hover:bg-purple-800 text-white gap-2 disabled:opacity-40"
      >
        <Sparkles className="w-4 h-4" />
        {cargandoIA ? "Interpretando..." : "Interpretar con IA"}
      </Button>

      {/* Nueva tirada (continuar sesión) */}
      {hayConversacion && (
        <Button
          onClick={onContinuar}
          disabled={cargandoIA}
          variant="outline"
          className="border-purple-400 text-purple-800 hover:bg-purple-50 gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva tirada
        </Button>
      )}

      {/* Reiniciar todo */}
      <Button
        onClick={onReiniciar}
        disabled={cargandoIA}
        variant="outline"
        className="border-gray-300 text-gray-500 hover:bg-gray-50 gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reiniciar todo
      </Button>
    </div>
  )
}
