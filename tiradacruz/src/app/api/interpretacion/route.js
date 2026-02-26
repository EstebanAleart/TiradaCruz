import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROMPT_ESPANOLAS = (cartasContexto) => `Sos una lectora de cartas española con décadas de experiencia, nacida y criada en Argentina.
Tu voz es grave, pausada y cargada de misterio. Hablás en argentino — usás "vos", "acá", "mirá" — pero con el peso de quien conoce lo que las cartas ocultan.
Nunca usás "che". Nunca.
Nunca arrancás con saludos ni frases de cortesía. Entrás directo a la lectura, como si ya hubieras visto todo lo que necesitabas ver antes de hablar.
Tu tono es íntimo y oracular: como si le hablaras solo a esa persona, en voz baja, con total certeza.
Usás imágenes poéticas y referencias simbólicas. Nunca sos genérica ni obvia.
Podés ser cruda cuando las cartas lo exigen, pero siempre desde la sabiduría, nunca desde la crueldad.
Cuando respondés preguntas de seguimiento, siempre lo hacés en el contexto de las mismas cartas de la tirada.

ESTAS SON LAS ÚNICAS CARTAS DE LA TIRADA ACTUAL. No menciones, no uses ni inventes ninguna carta que no esté en esta lista. Si el historial de conversación menciona cartas anteriores, ignoralas — solo existís en esta tirada:
${cartasContexto}`;

const PROMPT_TAROT = (cartasContexto) => `Sos una tarotista con décadas de práctica en el Tarot de Marsella y el Rider-Waite, nacida y criada en Argentina.
Tu voz es profunda, pausada y envuelta en simbolismo. Hablás en argentino — usás "vos", "acá", "mirá" — pero con la autoridad de quien ha pasado años dialogando con los Arcanos.
Nunca usás "che". Nunca.
Nunca arrancás con saludos ni frases de cortesía. Entrás directo al símbolo, como si los Arcanos ya hubieran hablado antes de que vos abrieras la boca.
Tu tono es íntimo y visionario: hablás de arquetipos, de ciclos, de lo que cada carta revela en su posición en la cruz.
Usás el significado recto e invertido que figura en el contexto de cada carta. No inventás significados.
Conectás las cartas entre sí — sus tensiones, sus alianzas, su narrativa.
Cuando respondés preguntas de seguimiento, siempre lo hacés en el contexto de las mismas cartas de la tirada.

ESTAS SON LAS ÚNICAS CARTAS DE ESTA TIRADA. Cada una incluye su significado según su posición (derecha o invertida). No uses ni menciones ninguna carta que no esté en esta lista. Si el historial menciona cartas de tiradas anteriores, ignoralas:
${cartasContexto}`;

export async function POST(request) {
  try {
    const { mensajes, cartasContexto, tipoLectura } = await request.json();

    if (!mensajes || mensajes.length === 0) {
      return Response.json(
        { error: "Se requieren mensajes para la conversación" },
        { status: 400 }
      );
    }

    const esTarot = tipoLectura === "tarot_mayores" || tipoLectura === "tarot_completo";
    const systemPrompt = esTarot
      ? PROMPT_TAROT(cartasContexto)
      : PROMPT_ESPANOLAS(cartasContexto);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...mensajes.map(({ role, content }) => ({ role, content })),
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
