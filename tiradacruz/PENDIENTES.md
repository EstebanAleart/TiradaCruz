# Pendientes — TiradaCruz

Hoja de ruta activa. Orden de prioridad: SEO → Analytics → Monetización → Backend.

---

## 1. SEO Programático

### Datos necesarios (crear en `data/`)

- [ ] `data/ciudades.json` — ~50 ciudades AR con `id` (slug), `nombre`, `provincia`, `contexto_local`
- [ ] `data/tipos-tirada.json` — amor, trabajo, salud, dinero, futuro, pareja, familia...
- [ ] `data/arcanos.json` — 22 arcanos mayores con `id`, `nombre`, `descripcion`, `palabras_clave`
- [ ] `data/cartas-espanolas.json` — 40 cartas con `id`, `nombre`, `palo`, `valor`, `descripcion_seo`
- [ ] `data/cartas-tarot.json` — 78 cartas con `id`, `nombre`, `tipo` (mayor/menor), `descripcion_seo`

### Rutas dinámicas — Baraja Española (~550 páginas)

- [ ] `app/tirada-de-cartas-espanolas/[tipo]/page.jsx` — ~10 páginas
- [ ] `app/tirada-de-cartas-espanolas/[tipo]/[ciudad]/page.jsx` — ~500 páginas
- [ ] `app/carta-espanola/[carta]/page.jsx` — 40 páginas (significado de cada carta)
- [ ] `generateStaticParams` en cada ruta
- [ ] `generateMetadata` con fórmula: pregunta + intent + urgencia

### Rutas dinámicas — Tarot (~600 páginas)

- [ ] `app/tirada-de-tarot/[tipo]/page.jsx` — ~10 páginas
- [ ] `app/tirada-de-tarot/[tipo]/[ciudad]/page.jsx` — ~500 páginas
- [ ] `app/arcano/[arcano]/page.jsx` — 22 páginas (significado de cada arcano mayor)
- [ ] `app/carta-tarot/[carta]/page.jsx` — 78 páginas (toda la baraja)
- [ ] `generateStaticParams` en cada ruta
- [ ] `generateMetadata` con fórmula adaptada a tarot

### Rutas genéricas por ciudad (~100 páginas)

- [ ] `app/tarot-gratis/[ciudad]/page.jsx`
- [ ] `app/tirada-gratis/[ciudad]/page.jsx`
- [ ] `app/tarot-online/[ciudad]/page.jsx`

### Sitemap

- [ ] Actualizar `app/sitemap.js` para generar todas las URLs dinámicas (~1.260 URLs)

### Fórmulas de copy (adaptar de miseguro.com.ar)

- [ ] Meta title: `[Tipo de tirada] en [Ciudad] | Gratis con IA · TiradaCruz`
- [ ] Meta description: pregunta de identificación + gratis + IA + urgencia mística
- [ ] Texto SEO visible en cada página (500+ palabras, sin copiar entre páginas)
- [ ] FAQ específica por página (al menos 3 preguntas únicas)

---

## 2. Analytics Dashboard

### Base de datos (Supabase)

- [ ] Crear proyecto en Supabase
- [ ] Tabla `visitas` — `ruta`, `ciudad_id`, `tipo_tirada`, `modo` (española/tarot), `dispositivo`, `referrer`, `pais`, `created_at`
- [ ] Tabla `interpretaciones` — `modo`, `tipo_tirada`, `ciudad_id`, `cartas_json`, `tiene_pregunta` (bool), `created_at` (sin datos personales)
- [ ] Tabla `api_keys` — `key_hash`, `nombre`, `plan`, `requests_mes`, `activa`, `created_at`
- [ ] Variables de entorno: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`

### Endpoint de tracking

- [ ] `app/api/analytics/visita/route.js` — POST, registra visita sin bloquear render
- [ ] Filtrar localhost para no ensuciar datos
- [ ] Llamar desde cada layout de ruta dinámica (fire and forget)

### Dashboard admin

- [ ] Ruta protegida `app/admin/page.jsx` — login con variable de entorno simple (no auth completa todavía)
- [ ] Gráfico de visitas por día (últimos 30 días)
- [ ] Top páginas por visitas
- [ ] Top ciudades
- [ ] Split español vs tarot
- [ ] Dispositivos (mobile vs desktop)
- [ ] Tabla de últimas interpretaciones

---

## 3. Monetización

### Quitar lo que no funciona

- [ ] Sacar todos los tags de PropellerAds del código
- [ ] Sacar EffectiveGateCPM
- [ ] Sacar `AdBanner.jsx` o vaciar su contenido
- [ ] Limpiar `sw.js` si tiene lógica de estos ads

### Cafecito (corto plazo, ya)

- [ ] Crear cuenta en cafecito.app
- [ ] Agregar botón/banner después de cada interpretación: "¿Te resonó? Invitame un café"
- [ ] Versión mobile-friendly (el 90% del tráfico es mobile)

### Afiliados (corto plazo)

- [ ] Links a mazos en MercadoLibre en páginas de carta individual (`/carta-espanola/[carta]`, `/carta-tarot/[carta]`)
- [ ] Texto natural: "Si querés tener tu propia [carta/mazo], acá podés conseguirla"

### Google AdSense (mediano plazo)

- [ ] Aplicar cuando lleguemos a ~100 clics/día orgánicos
- [ ] Asegurar disclaimer de entretenimiento en footer antes de aplicar
- [ ] Disclaimer: "Este sitio es para fines de entretenimiento. No reemplaza consejos profesionales."

### API pública con API keys (mediano plazo)

- [ ] Endpoint `app/api/v1/interpretacion/route.js` — mismo que el interno pero con auth por header `X-API-Key`
- [ ] Middleware de validación: buscar key en Supabase, verificar límite mensual
- [ ] Documentación mínima en `/docs` o README
- [ ] Planes: Free (100 req/mes), Pro (ilimitado, pago)

### Freemium (largo plazo, requiere auth completa)

- [ ] Auth con NextAuth v5
- [ ] Límite de follow-ups para plan Free (3 por tirada)
- [ ] Plan Premium: follow-ups ilimitados, historial en DB, descarga PDF
- [ ] Pagos: Stripe (internacional) + MercadoPago (AR)

---

## 4. Mejoras técnicas

- [ ] Agregar `next/image` para las cartas (mejora Core Web Vitals → SEO)
- [ ] Lazy loading del componente de tirada (el JS de la app no debe bloquear el LCP de las landing pages)
- [ ] Separar layouts: landing SEO (server) vs app interactiva (client)
- [ ] Mejorar JSON-LD: agregar `FAQPage` schema en páginas con FAQ
- [ ] Agregar `BreadcrumbList` schema en rutas dinámicas

---

## Resumen de volumen esperado

| Sección | Páginas |
|---|---|
| Española × tipo | ~10 |
| Española × tipo × ciudad | ~500 |
| Carta española | 40 |
| Tarot × tipo | ~10 |
| Tarot × tipo × ciudad | ~500 |
| Arcano mayor | 22 |
| Carta tarot completa | 78 |
| Genéricas × ciudad | ~100 |
| **Total** | **~1.260 páginas** |

---

## Orden de ejecución sugerido

1. Datos JSON (`ciudades`, `tipos-tirada`, `arcanos`, `cartas-espanolas`, `cartas-tarot`)
2. Rutas dinámicas + `generateStaticParams` + `generateMetadata`
3. Sitemap dinámico
4. Quitar PropellerAds + EffectiveGateCPM
5. Cafecito (5 minutos de trabajo)
6. Supabase + tabla visitas + endpoint analytics
7. Dashboard admin
8. API pública con API keys
9. AdSense (cuando el tráfico lo justifique)
10. Freemium + pagos (última fase)
