import { Button } from "@/components/ui/button"
import { Shuffle, RotateCcw, Play, Sparkles, RefreshCw } from "lucide-react"

export default function Controls({
  onMezclar,
  onCortar,
  onTirar,
  onInterpretar,
  onContinuar,
  onReiniciar,
  mezclas,
  cortes,
  puedeCortar,
  puedeRealizar,
  puedeInterpretar,
  cargandoIA,
  hayConversacion,
}) {
  return (
    <div className="flex justify-center gap-4 mb-8 flex-wrap">
      <Button
        onClick={onMezclar}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
      >
        <Shuffle className="w-5 h-5" />
        Mezclar ({mezclas})
      </Button>

      <Button
        onClick={onCortar}
        disabled={!puedeCortar}
        variant={!puedeCortar ? "secondary" : "default"}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
      >
        <RotateCcw className="w-5 h-5" />
        Cortar ({cortes}/1)
      </Button>

      <Button
        onClick={onTirar}
        disabled={!puedeRealizar}
        variant={!puedeRealizar ? "secondary" : "default"}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3"
      >
        <Play className="w-5 h-5" />
        Realizar Tirada
      </Button>

      <Button
        onClick={onInterpretar}
        disabled={!puedeInterpretar}
        variant={!puedeInterpretar ? "secondary" : "default"}
        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
      >
        <Sparkles className="w-5 h-5" />
        {cargandoIA ? "Interpretando..." : "Interpretar con IA"}
      </Button>

      {hayConversacion && (
        <Button
          onClick={onContinuar}
          disabled={cargandoIA}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3"
        >
          <RefreshCw className="w-5 h-5" />
          Nueva tirada (continuar sesión)
        </Button>
      )}

      <Button
        onClick={onReiniciar}
        variant="outline"
        className="flex items-center gap-2 bg-white/80 hover:bg-white border-amber-300 text-amber-800 px-6 py-3"
      >
        <RotateCcw className="w-5 h-5" />
        Reiniciar todo
      </Button>
    </div>
  )
}
