export default function PreguntaInput({ value, onChange }) {
  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-lg border border-amber-200 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-900">
        Tu Pregunta para la Tirada
      </h2>
      <label
        htmlFor="user-question"
        className="block text-gray-700 text-sm font-bold mb-2 text-left"
      >
        Escribí tu pregunta (opcional):
      </label>
      <textarea
        id="user-question"
        rows={3}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-400"
        placeholder="Ej: ¿Cómo va a evolucionar mi trabajo en los próximos meses?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-gray-500 mt-2 text-left">
        La IA va a usar tu pregunta para darte una lectura más personalizada.
      </p>
    </div>
  )
}
