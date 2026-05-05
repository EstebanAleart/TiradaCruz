import CartaTarotEnTirada from "@/components/tarot/CartaTarot"

export default function CruzLayoutTarot({ cartasTirada, mostrar }) {
  const c = (i) => cartasTirada[i] ?? null

  return (
    <div
      className="grid gap-2 mx-auto"
      style={{ gridTemplateColumns: "repeat(3, 68px)", gridTemplateRows: "repeat(3, auto)" }}
    >
      <div />
      <CartaTarotEnTirada carta={c(1)} posicion="Futuro"    mostrar={mostrar} isReversed={c(1)?.isReversed} delay={0}   />
      <div />

      <CartaTarotEnTirada carta={c(3)} posicion="Pasado"    mostrar={mostrar} isReversed={c(3)?.isReversed} delay={200} />
      <CartaTarotEnTirada carta={c(0)} posicion="Presente"  mostrar={mostrar} isReversed={c(0)?.isReversed} delay={400} />
      <CartaTarotEnTirada carta={c(4)} posicion="Consejo"   mostrar={mostrar} isReversed={c(4)?.isReversed} delay={600} />

      <div />
      <CartaTarotEnTirada carta={c(2)} posicion="Resultado" mostrar={mostrar} isReversed={c(2)?.isReversed} delay={800} />
      <div />
    </div>
  )
}
