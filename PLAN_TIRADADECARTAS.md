# 🔮 Plan de Mejora — tiradadecartas.com.ar

> Proyecto: Tirada de Cartas Españolas en Cruz  
> Stack: Next.js (App Router) + JavaScript + JSX  
> Deploy: Vercel  
> Repo: https://github.com/EstebanAleart/TiradaCruz  
> Dominio: tiradadecartas.com.ar

---

## ✅ CRONOGRAMA DE TAREAS

### 🟡 FASE 2 — SEO (Prioridad actual)

#### Tarea 2.1 — Metadata en layout.jsx

Agregar o reemplazar en `src/app/layout.jsx`:
```js
export const metadata = {
  title: "Tirada de Cartas Gratis | Tarot en Cruz Online",
  description: "Realizá tu tirada de cartas gratis. Tarot en cruz con interpretación personalizada con IA. Consultá el pasado, presente y futuro.",
  keywords: "tirada de cartas gratis, tarot online, tirada en cruz, cartas del tarot, tarot gratis argentina",
  metadataBase: new URL("https://tiradadecartas.com.ar"),
  openGraph: {
    title: "Tirada de Cartas Gratis | Tarot en Cruz Online",
    description: "Consultá el tarot gratis con interpretación por IA. Tirada en cruz con cartas españolas.",
    url: "https://tiradadecartas.com.ar",
    siteName: "Tirada de Cartas",
    locale: "es_AR",
    type: "website",
  },
};
```

---

#### Tarea 2.2 — Schema markup en layout.jsx

Agregar dentro del `<body>` en `layout.jsx`:
```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Tirada de Cartas en Cruz",
      "description": "Tirada de tarot gratis online con interpretación por inteligencia artificial",
      "url": "https://tiradadecartas.com.ar",
      "applicationCategory": "EntertainmentApplication",
      "inLanguage": "es-AR",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "ARS"
      }
    })
  }}
/>
```

---

#### Tarea 2.3 — Texto SEO visible en la página

Agregar una sección de texto debajo de la tirada en `page.jsx`.  
Google necesita contenido textual para entender y rankear la página:

```jsx
<section className="seo-text">
  <h2>¿Qué es la Tirada en Cruz?</h2>
  <p>
    La tirada en cruz es una de las consultas de tarot más completas y utilizadas.
    Permite explorar una situación desde cinco ángulos distintos: el pasado que la originó,
    el presente en el que te encontrás, el futuro probable, el consejo de las cartas
    y el resultado final.
  </p>
  <h2>¿Cómo funciona esta tirada de cartas gratis?</h2>
  <p>
    Mezclá el mazo, cortá las cartas y realizá tu tirada. Nuestra inteligencia artificial
    analizará las cartas que salieron y su posición para darte una interpretación
    personalizada y profunda, en español y pensada para vos.
  </p>
</section>
```

---

#### Tarea 2.4 — Sitemap automático

Crear `src/app/sitemap.js`:
```js
export default function sitemap() {
  return [
    {
      url: "https://tiradadecartas.com.ar",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

---

#### Tarea 2.5 — Robots.txt

Crear `src/app/robots.js`:
```js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tiradadecartas.com.ar/sitemap.xml",
  };
}
```

---

### 🟢 FASE 3 — Publicidad (Semana 2-3)

#### Opción recomendada: Ezoic o PropellerAds
- **Ezoic**: Sin mínimo de tráfico, optimización automática con IA, fácil integración
- **PropellerAds**: Sin requisitos, acepta contenido esotérico, paga por impresiones

#### Tarea 3.1 — Integrar Ezoic
1. Registrarse en ezoic.com
2. Verificar el dominio tiradadecartas.com.ar
3. Agregar el script que proveen en `layout.jsx`
4. Definir zonas de anuncios (header, entre secciones, footer)

#### Tarea 3.2 — Placeholder de anuncio (para cuando esté listo)
```jsx
{/* Zona de anuncio — reemplazar con script de Ezoic/PropellerAds */}
<div id="ad-banner-top" style={{ minHeight: "90px", textAlign: "center" }}>
  {/* Ad script va acá */}
</div>
```

---

### 🔵 FASE 4 — Mejoras de UX e IA (Semana 3-4)

#### Tarea 4.1 — Cartas invertidas
Agregar lógica de cartas invertidas (30% de probabilidad al mezclar).  
Ya está soportado en el endpoint de Groq — solo falta pasarle `invertida: true/false`.

#### Tarea 4.2 — Historial de tiradas
Guardar en `localStorage` las últimas 3 tiradas con fecha y pregunta.

#### Tarea 4.3 — Compartir resultado
Botón para copiar o compartir la interpretación por WhatsApp:
```js
const compartir = () => {
  const texto = `🔮 Mi tirada de cartas dice:\n\n${interpretacion}\n\nHacé la tuya en tiradadecartas.com.ar`;
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
};
```

#### Tarea 4.4 — Segunda modalidad: Tirada de Tarot clásico
Usar la API `https://tarot-api-es.vercel.app/api/v1/cards` para una tirada con los 78 arcanos.  
Mostrar la imagen de cada carta (`card.image`).

#### Tarea 4.5 — Animaciones de mezcla y volteo
Mejorar la experiencia visual con animaciones CSS al revelar cada carta.

---

## 📋 CHECKLIST RÁPIDO

```
FASE 2 — SEO
[ ] Metadata en layout.jsx
[ ] Schema markup en layout.jsx
[ ] Texto SEO visible en page.jsx
[ ] Crear sitemap.js
[ ] Crear robots.js
[ ] Registrar en Google Search Console
[ ] Subir sitemap en Search Console

FASE 3 — Publicidad
[ ] Elegir red: Ezoic o PropellerAds
[ ] Registrar dominio en la red elegida
[ ] Integrar script en layout.jsx
[ ] Definir zonas de anuncios

FASE 4 — UX
[ ] Cartas invertidas
[ ] Historial en localStorage
[ ] Botón compartir por WhatsApp
[ ] Tirada con tarot clásico (API externa)
[ ] Animaciones de volteo de cartas
```

---

## 🔑 VARIABLES DE ENTORNO NECESARIAS

| Variable | Valor | Dónde obtenerla |
|----------|-------|-----------------|
| `GROQ_API_KEY` | sk-groq-... | console.groq.com (gratis) |

Agregar en:
- `.env.local` (desarrollo local)
- Vercel → Settings → Environment Variables (producción)

---

## 📎 REFERENCIAS

- Repo: https://github.com/EstebanAleart/TiradaCruz
- Sitio actual: https://tiradacruz.vercel.app
- Dominio nuevo: https://tiradadecartas.com.ar
- API de Tarot: https://tarot-api-es.vercel.app/api/v1/cards
- Groq Console: https://console.groq.com
- Google Search Console: https://search.google.com/search-console
- Ezoic: https://ezoic.com
- PropellerAds: https://propellerads.com
