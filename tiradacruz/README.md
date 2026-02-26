# TiradaCruz 🃏

Aplicación web de tirada de cartas online con interpretación por IA. Baraja española disponible, tarot clásico en camino, con backend, base de datos y monetización en el roadmap.

> **Estándares y convenciones del proyecto:** ver `README de la vida.md`.

---

## Stack actual

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
src/
├── app/
│   ├── api/interpretacion/route.js    # POST → Groq → chat con historial
│   ├── layout.js                       # SEO: metadata, JSON-LD, OG, lang="es"
│   └── page.jsx                        # Server component — ensambla todo
├── components/
│   ├── ModoApp.jsx                     # "use client" — selector española / tarot
│   ├── espanolas/
│   │   ├── TiradaEspanola.jsx          # "use client" — estado completo de la sesión
│   │   ├── Controls.jsx                # botones de acción
│   │   ├── EstadoMazo.jsx              # status bar
│   │   ├── ChatLectura.jsx             # chat con burbujas + descarga .txt
│   │   └── CardImage.jsx              # imágenes PNG de las cartas
│   ├── landing/
│   │   ├── Hero.jsx                    # server — header SEO
│   │   ├── SeoContent.jsx              # server — texto keywords
│   │   ├── FAQ.jsx                     # "use client" — accordion
│   │   └── Footer.jsx                  # server
│   ├── shared/
│   │   ├── CartaEnTirada.jsx           # carta individual (reutilizable española + tarot)
│   │   ├── CruzLayout.jsx              # grid en cruz 5 cartas
│   │   ├── InterpretacionPanel.jsx     # loading / error / resultado
│   │   └── PreguntaInput.jsx           # textarea pregunta
│   └── ui/button.jsx                   # shadcn
└── lib/
    ├── baraja.js                       # constantes + funciones puras baraja española
    └── utils.js                        # clsx util

public/
└── cards/                              # 49 PNGs baraja española
```

### Mecánica de sesión de chat

No hay websockets ni estado en servidor. El historial de conversación vive en el **estado de React** (`conversacion: [{role, content}]`) y se manda completo en cada request a `/api/interpretacion`. Groq recibe el array y responde en contexto. Simple, stateless, sin costo extra.

### Baraja española

- **Palos:** oros, copas, espadas, bastos
- **Valores:** 1–7, 10 (Sota), 11 (Caballo), 12 (Rey) → 40 cartas
- **Mecánica:**
  - Mezcla (N veces) → Corte (1 vez) → Tirada en cruz (5 cartas, inversión 50%)
  - Chat con IA: primera lectura + follow-ups en la misma sesión
  - "Continuar sesión": nueva tirada sin perder el historial de chat

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `GROQ_API_KEY` | API key de [console.groq.com](https://console.groq.com) — plan gratuito |

Ver `.env.local.example`. En Vercel: Settings → Environment Variables.

---

## Roadmap

### SEO

- [x] Metadata + OG tags en `layout.js`
- [x] JSON-LD `WebApplication` con geolocalización Argentina
- [x] Sitemap (`/sitemap.xml`)
- [x] Robots.txt (`/robots.txt`)
- [x] Texto SEO visible con keywords (`SeoContent.jsx`, `FAQ.jsx`)
- [x] Registrar en Google Search Console + subir sitemap

### UX / Features

- [x] Animaciones flip al revelar cartas
- [x] Historial de tiradas en `localStorage`
- [x] Botón compartir por WhatsApp
- [x] Cartas invertidas (`isReversed: Math.random() < 0.5` en ambos modos)

### Integración Tarot (Arcanos)

> Regla: la baraja española queda como opción independiente. El tarot es un modo nuevo.

- [x] `components/tarot/TiradaTarot.jsx` — mismo patrón que `TiradaEspanola.jsx`
- [x] `components/tarot/CorteTresMontones.jsx` — 3 pilas clickeables
- [x] `components/tarot/CruzLayoutTarot.jsx`, `CartaTarot.jsx`, `ControlsTarot.jsx`
- [x] `lib/tarot.js` — baraja de arcanos mayores (22) y completa (78), cacheada en local
- [x] Prompt diferenciado por `tipoLectura` en `route.js`
- [x] Activado en `ModoApp.jsx` con selector de submodo (mayores / completo)

### Monetización

**Corto plazo** (poco tráfico, sin backend):
- [ ] **PropellerAds** o **Adsterra** — sin requisitos, acepta contenido esotérico

**Medio plazo** (con backend + DB):
- [ ] Modelo freemium (ver tabla de planes abajo)
- [ ] **Stripe** — pagos internacionales + suscripciones recurrentes
- [ ] **MercadoPago** — mercado argentino
- [ ] Webhook de pagos → actualizar suscripciones en DB

**Largo plazo**:
- [ ] **Ezoic** o **Media.net** cuando haya tráfico constante (mejor RPM)

#### Planes previstos

| Plan | Tiradas/día | Chat follow-ups | Modos |
|------|-------------|-----------------|-------|
| Free (con anuncios) | Ilimitadas | 3 por tirada | Española |
| Premium | Ilimitadas | Ilimitados | Española + Tarot |

### Backend (cuando la app crezca)

- [ ] Separar backend en servicio propio (Railway o Render)
- [ ] Arquitectura hexagonal: dominio sin dependencia de infraestructura
- [ ] API RESTful con Express o Fastify
- [ ] Auth: NextAuth v5 + Auth0

### Base de datos — Modelo de suscripción

Stack según `README de la vida.md`: **Supabase (PostgreSQL) + Sequelize**

#### Modelo entidad-relación (borrador)

```
usuarios
  id          UUID PK
  email       STRING UNIQUE
  nombre      STRING
  plan        ENUM('free', 'premium')
  created_at  TIMESTAMP

suscripciones
  id              UUID PK
  usuario_id      UUID FK → usuarios.id
  plan            ENUM('premium_mes', 'premium_anual')
  estado          ENUM('activa', 'cancelada', 'vencida')
  fecha_inicio    DATE
  fecha_fin       DATE
  metodo_pago     ENUM('stripe', 'mercadopago')
  external_id     STRING   ← ID de la suscripción en Stripe/MP

tiradas
  id          UUID PK
  usuario_id  UUID FK → usuarios.id (nullable — usuarios anónimos)
  modo        ENUM('espanolas', 'tarot_mayores', 'tarot_completo')
  cartas      JSONB    ← snapshot de las 5 cartas + posición + inversión
  pregunta    TEXT
  created_at  TIMESTAMP

mensajes_chat
  id          UUID PK
  tirada_id   UUID FK → tiradas.id
  role        ENUM('user', 'assistant')
  content     TEXT
  created_at  TIMESTAMP
```

**Tareas pendientes DB:**
- [ ] Crear proyecto en Supabase
- [ ] Definir migraciones con Sequelize
- [ ] Implementar Auth (NextAuth v5 + Auth0)
- [ ] Middleware de plan en `/api/interpretacion` — verificar límite de follow-ups para free
- [ ] Guardar tiradas y chat en DB
- [ ] Dashboard de usuario: historial, estado de suscripción

---

## Referencias

- Repo: https://github.com/EstebanAleart/TiradaCruz
- Dominio: https://tiradadecartas.com.ar
- API de Tarot: https://tarot-api-es.vercel.app/api/v1/cards
- Groq Console: https://console.groq.com
- Google Search Console: https://search.google.com/search-console
