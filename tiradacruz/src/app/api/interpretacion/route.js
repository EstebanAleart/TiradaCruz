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

    const systemPrompt = `Sos una lectora de cartas española experta, nacida y criada en Argentina.
Hablás con el acento y modismos argentinos (vos, che, boludo/a de manera afectuosa si corresponde).
Sos mística, sabia y empática. Interpretás la baraja española con profundidad y sensibilidad.
Tus lecturas son detalladas pero fluidas, sin ser repetitivas.
Usás lenguaje coloquial argentino mezclado con misticismo.`;

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
