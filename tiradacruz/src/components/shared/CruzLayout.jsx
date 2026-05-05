import CartaEnTirada from "@/components/shared/CartaEnTirada"

// Cruz 3x3: Futuro arriba, Pasado-Presente-Consejo en el medio, Resultado abajo
export default function CruzLayout({ cartasTirada, mostrar }) {
  const c = (i) => cartasTirada[i] ?? null

  return (
    <div
      className="grid gap-2 mx-auto"
      style={{ gridTemplateColumns: "repeat(3, 68px)", gridTemplateRows: "repeat(3, auto)" }}
    >
      <div />
      <CartaEnTirada carta={c(1)} posicion="Futuro"    mostrar={mostrar} isReversed={c(1)?.isReversed} delay={0}   />
      <div />

      <CartaEnTirada carta={c(3)} posicion="Pasado"    mostrar={mostrar} isReversed={c(3)?.isReversed} delay={200} />
      <CartaEnTirada carta={c(0)} posicion="Presente"  mostrar={mostrar} isReversed={c(0)?.isReversed} delay={400} />
      <CartaEnTirada carta={c(4)} posicion="Consejo"   mostrar={mostrar} isReversed={c(4)?.isReversed} delay={600} />

      <div />
      <CartaEnTirada carta={c(2)} posicion="Resultado" mostrar={mostrar} isReversed={c(2)?.isReversed} delay={800} />
      <div />
    </div>
  )
}
