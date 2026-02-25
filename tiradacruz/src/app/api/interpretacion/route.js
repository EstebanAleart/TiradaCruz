import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { cartas, pregunta } = await request.json();

    if (!cartas || cartas.length !== 5) {
      return Response.json(
        { error: "Se requieren exactamente 5 cartas" },
        { status: 400 }
      );
    }

    const posiciones = [
      "Carta 1 - Centro (Presente): Tu situación actual",
      "Carta 2 - Arriba (Futuro): Lo que está por venir",
      "Carta 3 - Abajo (Resultado): El desenlace final",
      "Carta 4 - Izquierda (Pasado): Influencias del pasado",
      "Carta 5 - Derecha (Consejo): Guía para actuar",
    ];

    const cartasTexto = cartas
      .map((carta, i) => {
        const estado = carta.isReversed ? "invertida" : "al derecho";
        return `- ${posiciones[i]}: ${carta.nombreCarta} (${estado})`;
      })
      .join("\n");

    const preguntaTexto = pregunta?.trim()
      ? `\nLa persona consulta específicamente: "${pregunta.trim()}"`
      : "";

    const systemPrompt = `Sos una lectora de cartas española con décadas de experiencia, nacida y criada en Argentina.
Tu voz es grave, pausada y cargada de misterio. Hablás en argentino — usás "vos", "acá", "mirá" — pero con el peso de quien conoce lo que las cartas ocultan.
Nunca usás "che". Nunca.
Nunca arrancás con saludos ni frases de cortesía. Entrás directo a la lectura, como si ya hubieras visto todo lo que necesitabas ver antes de hablar.
Tu tono es íntimo y oracular: como si le hablaras solo a esa persona, en voz baja, con total certeza.
Usás imágenes poéticas y referencias simbólicas. Nunca sos genérica ni obvia.
Podés ser cruda cuando las cartas lo exigen, pero siempre desde la sabiduría, nunca desde la crueldad.`;

    const userPrompt = `Realizá la interpretación de esta tirada en cruz:

${cartasTexto}
${preguntaTexto}

Interpretá cada carta en su posición y luego dá una lectura global cohesiva.
Sé detallada y mística, usá el tono argentino que te caracteriza.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.85,
      max_tokens: 1200,
    });

    const interpretacion = completion.choices[0]?.message?.content;

    if (!interpretacion) {
      return Response.json(
        { error: "No se pudo obtener la interpretación" },
        { status: 500 }
      );
    }

    return Response.json({ interpretacion });
  } catch (error) {
    console.error("Error llamando a Groq:", error);
    return Response.json(
      { error: "Error al conectar con el servicio de IA" },
      { status: 500 }
    );
  }
}
