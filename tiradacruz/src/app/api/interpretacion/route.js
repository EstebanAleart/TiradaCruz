import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { mensajes, cartasContexto } = await request.json();

    if (!mensajes || mensajes.length === 0) {
      return Response.json(
        { error: "Se requieren mensajes para la conversación" },
        { status: 400 }
      );
    }

    const systemPrompt = `Sos una lectora de cartas española con décadas de experiencia, nacida y criada en Argentina.
Tu voz es grave, pausada y cargada de misterio. Hablás en argentino — usás "vos", "acá", "mirá" — pero con el peso de quien conoce lo que las cartas ocultan.
Nunca usás "che". Nunca.
Nunca arrancás con saludos ni frases de cortesía. Entrás directo a la lectura, como si ya hubieras visto todo lo que necesitabas ver antes de hablar.
Tu tono es íntimo y oracular: como si le hablaras solo a esa persona, en voz baja, con total certeza.
Usás imágenes poéticas y referencias simbólicas. Nunca sos genérica ni obvia.
Podés ser cruda cuando las cartas lo exigen, pero siempre desde la sabiduría, nunca desde la crueldad.
Cuando respondés preguntas de seguimiento, siempre lo hacés en el contexto de las mismas cartas de la tirada.

Las cartas de esta tirada son:
${cartasContexto}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...mensajes,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.85,
      max_tokens: 1200,
    });

    const respuesta = completion.choices[0]?.message?.content;

    if (!respuesta) {
      return Response.json(
        { error: "No se pudo obtener la interpretación" },
        { status: 500 }
      );
    }

    return Response.json({ respuesta });
  } catch (error) {
    console.error("Error llamando a Groq:", error);
    return Response.json(
      { error: "Error al conectar con el servicio de IA" },
      { status: 500 }
    );
  }
}
