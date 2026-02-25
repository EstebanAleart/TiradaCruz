import CartaEnTirada from "@/components/shared/CartaEnTirada"

// Índices: 0=Presente, 1=Futuro, 2=Resultado, 3=Pasado, 4=Consejo
export default function CruzLayout({ cartasTirada, mostrar }) {
  const carta = (i) => cartasTirada[i] ?? null

  return (
    <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:grid-rows-3 md:gap-x-16 md:gap-y-8 md:items-center md:justify-items-center">
      <div className="md:col-start-2 md:row-start-1">
        <CartaEnTirada carta={carta(1)} posicion="Futuro" mostrar={mostrar} isReversed={carta(1)?.isReversed} />
      </div>
      <div className="md:col-start-1 md:row-start-2">
        <CartaEnTirada carta={carta(3)} posicion="Pasado" mostrar={mostrar} isReversed={carta(3)?.isReversed} />
      </div>
      <div className="md:col-start-2 md:row-start-2">
        <CartaEnTirada carta={carta(0)} posicion="Presente" mostrar={mostrar} isReversed={carta(0)?.isReversed} />
      </div>
      <div className="md:col-start-3 md:row-start-2">
        <CartaEnTirada carta={carta(4)} posicion="Consejo" mostrar={mostrar} isReversed={carta(4)?.isReversed} />
      </div>
      <div className="md:col-start-2 md:row-start-3">
        <CartaEnTirada carta={carta(2)} posicion="Resultado" mostrar={mostrar} isReversed={carta(2)?.isReversed} />
      </div>
    </div>
  )
}
