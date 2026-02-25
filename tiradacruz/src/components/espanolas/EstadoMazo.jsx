export default function EstadoMazo({ totalCartas, mezclas, cortes }) {
  return (
    <div className="mt-8 text-center">
      <div className="bg-white/70 rounded-xl p-4 inline-block shadow-sm border border-amber-200">
        <p className="text-sm text-amber-800 font-medium">
          Cartas en el mazo: {totalCartas} | Mezclas: {mezclas} | Cortes: {cortes}/1
        </p>
      </div>
    </div>
  )
}
