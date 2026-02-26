// Misma disposición en cruz que CruzLayout (espanolas)
// Índices: 0=Presente, 1=Futuro, 2=Resultado, 3=Pasado, 4=Consejo
import CartaTarotEnTirada from "@/components/tarot/CartaTarot"

export default function CruzLayoutTarot({ cartasTirada, mostrar }) {
  const carta = (i) => cartasTirada[i] ?? null

  return (
    <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:grid-rows-3 md:gap-x-16 md:gap-y-8 md:items-center md:justify-items-center">
      <div className="md:col-start-2 md:row-start-1">
        <CartaTarotEnTirada carta={carta(1)} posicion="Futuro" mostrar={mostrar} isReversed={carta(1)?.isReversed} delay={0} />
      </div>
      <div className="md:col-start-1 md:row-start-2">
        <CartaTarotEnTirada carta={carta(3)} posicion="Pasado" mostrar={mostrar} isReversed={carta(3)?.isReversed} delay={150} />
      </div>
      <div className="md:col-start-2 md:row-start-2">
        <CartaTarotEnTirada carta={carta(0)} posicion="Presente" mostrar={mostrar} isReversed={carta(0)?.isReversed} delay={300} />
      </div>
      <div className="md:col-start-3 md:row-start-2">
        <CartaTarotEnTirada carta={carta(4)} posicion="Consejo" mostrar={mostrar} isReversed={carta(4)?.isReversed} delay={450} />
      </div>
      <div className="md:col-start-2 md:row-start-3">
        <CartaTarotEnTirada carta={carta(2)} posicion="Resultado" mostrar={mostrar} isReversed={carta(2)?.isReversed} delay={600} />
      </div>
    </div>
  )
}
