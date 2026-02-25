# TiradaCruz 🃏

Aplicación web de tirada de cartas online con interpretación por IA. Arrancó con baraja española y va a sumar tarot completo.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Lenguaje | JavaScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| IA | Groq SDK — `llama-3.3-70b-versatile` |
| Deploy | Vercel |

---

## Correr local

```bash
cd tiradacruz
npm install
# Crear .env.local con:
# GROQ_API_KEY=tu_key_de_groq
npm run dev
```

La app corre en `http://localhost:3000`.

---

## Deploy en Vercel

1. Push a `main`
2. En Vercel → Settings → Environment Variables → agregar `GROQ_API_KEY`
3. Redeploy

---

## Estructura actual

```
src/app/
├── page.jsx                        # App principal (tirada española en cruz)
├── layout.js                       # SEO: metadata, JSON-LD, OG tags, lang="es"
├── globals.css
├── api/
│   └── interpretacion/
│       └── route.js                # POST → Groq API → interpretación en español AR
└── components/
    ├── card-image.jsx              # Componentes de imagen (frente + reverso)
    └── ui/                         # shadcn/ui

public/
└── cards/                          # 49 PNGs — baraja española (40 cartas + reverso + extras)
                                    # Formato: 01-bastos.png, 07-oros.png, etc.
```

### Baraja española

- **Palos:** oros, copas, espadas, bastos
- **Valores:** 1–7, 10 (Sota), 11 (Caballo), 12 (Rey) → 40 cartas
- **Mecánica de la app:**
  - Mezcla (N veces, sin límite)
  - Corte (1 vez, posición aleatoria)
  - Tirada en cruz (5 cartas, con inversión aleatoria 50%)
  - Interpretación vía Groq con prompt en español argentino

---

## ⏳ Pendiente

### 1. Monetización

**Corto plazo** (poco tráfico):
- [ ] Integrar **PropellerAds** o **Adsterra** — banners display + push notifications. Rinden aunque el tráfico sea bajo.

**Medio plazo** (modelo mixto — recomendado):
- [ ] Tirada gratuita con anuncios
- [ ] Tirada premium sin anuncios — **1–2 € por sesión** con Stripe o MercadoPago
  - Mayor conversión que depender solo de CPM con tráfico chico
  - Stripe para pagos internacionales, MercadoPago para Argentina

**Largo plazo** (tráfico establecido):
- [ ] Migrar a **Ezoic** o **Media.net** — mejor RPM que AdSense/Adsterra cuando hay visitas constantes

---

### 2. Integración con Tarot (Arcanos)

> **Regla fundamental:** respetar toda la matemática y lógica aplicada a la baraja española.
> Las cartas españolas quedan como opción. Se suma el tarot como modo nuevo.

#### API de cartas

```
GET https://tarot-api-es.vercel.app/api/v1/cards
```

Devuelve 78 cartas con esta estructura:

```json
{
  "nhits": 78,
  "cards": [
    {
      "type": "mayor",
      "name_short": "ar01",
      "name": "El Mago",
      "value": "1",
      "value_int": 1,
      "image": "url",
      "meaning_up": "significado al derecho",
      "meaning_rev": "significado invertida",
      "amor": "...",
      "trabajo": "...",
      "finanzas": "...",
      "salud": "...",
      "espiritualidad": "...",
      "desc": "descripción simbólica"
    }
  ]
}
```

#### Modos de juego

| Modo | Cartas | Descripción |
|------|--------|-------------|
| Simple | 22 | Solo Arcanos Mayores — más psicológico, recomendado para principiantes |
| Completo | 78 | 22 Mayores + 56 Menores (Bastos, Copas, Espadas, Oros) |

#### Mecánica de mezcla y corte (diferente a española)

**Paso 1 — Mezcla:**
- El consultante mezcla pensando en su pregunta
- Se recomiendan 7 mezclas completas pero no es obligatorio
- Sin número exacto impuesto

**Paso 2 — Corte en 3 montones:**
- Se divide el mazo en 3 montones
- El consultante **elige el orden** para reagruparlos
- El orden elegido representa simbólicamente:
  - Montón 1 → **Mente**
  - Montón 2 → **Emoción**
  - Montón 3 → **Acción**
  - *(o Pasado / Presente / Futuro según escuela)*
- En la app: 3 pilas clickeables, el usuario hace click en el orden que quiere

#### Tirada en Cruz (5 cartas) — misma estructura que española

```
          [Arriba]
           Futuro

[Izq]    [Centro]    [Der]
Pasado   Presente    Consejo

          [Abajo]
          Resultado
```

| Posición | Significado |
|----------|-------------|
| Centro | Situación actual |
| Arriba | Lo que favorece / futuro cercano |
| Abajo | Base / raíz del problema |
| Izquierda | Pasado |
| Derecha | Futuro inmediato o Consejo |

#### Cartas aclaratorias (opcional, post-tirada)

- Solo si hay contradicción entre cartas
- Solo si cae una carta muy fuerte (ej: La Muerte, La Torre)
- Se llama "Carta aclaratoria" — se roba 1 carta adicional para esa posición
- No es parte de la cruz base, es un añadido

#### Diferencias clave vs Baraja Española

| Aspecto | Española | Tarot |
|---------|----------|-------|
| Enfoque | Predictivo | Psicológico / simbólico |
| Figuras | Sociales (sota, caballo, rey) | Arquetipos universales |
| Profundidad simbólica | Media | Alta |
| Cartas | 40 | 78 |
| Inversión | Sí | Sí |

#### Prompt IA para tarot

El prompt de Groq para tarot va a usar los campos de la API directamente:
- `meaning_up` / `meaning_rev` según si la carta está invertida
- Los campos temáticos (`amor`, `trabajo`, etc.) si el consultante eligió un tema
- El `desc` para enriquecer la interpretación simbólica

#### Implementación — tareas pendientes

- [ ] Componente selector de modo: `EspañolasMode` / `TarotMayores` / `TarotCompleto`
- [ ] Fetch y cache de la API de tarot (se puede guardar en un JSON estático para no depender de la API en runtime)
- [ ] Componente de corte en 3 montones con drag o click
- [ ] Componente de carta aclaratoria
- [ ] Adaptar `route.js` para recibir cartas de tarot y usar sus campos `meaning_up`/`meaning_rev`
- [ ] Imágenes: la API devuelve URLs propias, verificar que sean accesibles

---

## SEO

- **Keywords objetivo:** tarot online argentina, tarot rosario, cartas españolas online, tirada gratis, tarot con IA
- Metadata en `layout.js` con OG tags y lang="es"
- JSON-LD `WebApplication` con geolocalización Argentina
- Sección FAQ accordion en landing (5 preguntas)
- Sección descriptiva con texto rico en keywords

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `GROQ_API_KEY` | API key de [console.groq.com](https://console.groq.com) — plan gratuito |

Ver `.env.local.example` para referencia.
