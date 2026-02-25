# 📋 Guía de Estándares y Mejores Prácticas del Proyecto

> Este documento es la **fuente de verdad** del proyecto. Todo desarrollador debe leerlo antes de escribir una sola línea de código.

---

## 📦 Stack Tecnológico

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | Next.js 16 | App Router, SSR/SSG/ISR según necesidad |
| Lenguaje | **JavaScript** (no TypeScript) | Preferencia del equipo |
| Estado global | Redux Toolkit | Slices + Optimistic Updates |
| Auth | NextAuth v5 + Auth0 como provider | Ver sección de Auth |
| ORM | Sequelize | Preferido. Prisma 6.10.0 como alternativa |
| Base de datos | Supabase (PostgreSQL) | |
| UI | NextUI + Tailwind CSS | |
| Formularios | React Hook Form + Zod | |
| Deploy back | Railway / Render | Ambos con buenas referencias |
| Deploy front | Vercel | Variables de entorno en panel |
| Package manager | npm | No uses pnpm — no es compatible con Next.js 16 |

---

## 🏗️ Arquitectura

### Principio General

El proyecto sigue una arquitectura **híbrida** que combina:

- **Hexagonal (Ports & Adapters)** en el backend — el dominio no conoce infraestructura.
- **Dirigida por Eventos (Event-Driven)** en el frontend — los componentes reaccionan a acciones del store, no se llaman entre sí directamente.
- **SSR selectivo** con Next.js — se usa Server-Side Rendering donde el SEO o la velocidad de primera carga lo justifiquen. Para paneles internos o dashboards, se prefiere CSR con Redux.

### ¿Cuándo usar SSR vs separar el backend?

- Usá **SSR con Next.js** (`app/` o `pages/`) cuando la app es mediana, el equipo es chico y querés ir rápido. Ideal para MVPs y proyectos donde el front y back comparten lógica de negocio simple.
- Separar el **backend en un servicio independiente** (Express/Fastify en Railway/Render) cuando la lógica de negocio crece, hay múltiples clientes (web, mobile, third-party), o necesitás escalar de forma independiente.

### Estructura de Carpetas

```
/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Rutas protegidas agrupadas
│   ├── api/                # Route Handlers (Edge o Node)
│   └── layout.js
│
├── src/
│   ├── domain/             # Entidades y lógica de negocio pura (sin frameworks)
│   │   ├── entities/
│   │   └── use-cases/
│   │
│   ├── infrastructure/     # Adaptadores: DB, APIs externas, Auth
│   │   ├── db/             # Sequelize models / Prisma schema
│   │   ├── repositories/   # Implementaciones de los ports
│   │   └── services/       # Servicios externos (email, storage, etc.)
│   │
│   ├── store/              # Redux Toolkit
│   │   ├── index.js        # configureStore
│   │   └── slices/         # Un archivo por feature
│   │
│   ├── components/         # Componentes React reutilizables
│   │   ├── ui/             # Componentes base (NextUI wrappers, etc.)
│   │   └── features/       # Componentes ligados a un feature específico
│   │
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades, helpers, constantes
│   └── styles/             # Globals, tokens de diseño
│
├── public/
├── .env.local
└── README.md               # Este archivo
```

---

## ⚡ Redux Toolkit — Estándar del Proyecto

Toda la lógica de estado global va en Redux Toolkit. Sin excepciones para estado compartido entre rutas o componentes distantes.

### Reglas

- **Un slice por feature.** No mezcles leads con users en el mismo slice.
- **Optimistic Updates siempre** para operaciones de escritura (create, update, delete). El usuario no espera.
- **Estado local** (`useState`) solo para UI efímera: toggles, inputs no controlados, modales locales.
- **Thunks para side effects** — toda llamada async va en `createAsyncThunk` o en un thunk manual dentro del slice.

### Estructura de un Slice con Optimistic Update

```js
// src/store/slices/leadsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { leadsRepository } from '@/infrastructure/repositories/leadsRepository'

// Thunk para crear un lead con optimistic update
export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData, { rejectWithValue }) => {
    try {
      const created = await leadsRepository.create(leadData)
      return created
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Thunk para actualizar con optimistic update
export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const updated = await leadsRepository.update(id, changes)
      return updated
    } catch (err) {
      return rejectWithValue({ id, error: err.message })
    }
  }
)

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [],
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Optimistic: mutá el estado antes de que llegue la respuesta del server
    optimisticUpdateLead(state, action) {
      const { id, changes } = action.payload
      const lead = state.items.find(l => l.id === id)
      if (lead) Object.assign(lead, changes)
    },
    optimisticDeleteLead(state, action) {
      state.items = state.items.filter(l => l.id !== action.payload)
    },
    optimisticAddLead(state, action) {
      // Agregamos con id temporal para rollback
      state.items.unshift({ ...action.payload, _optimistic: true })
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createLead.fulfilled, (state, action) => {
        // Reemplazamos el item optimista con el real del servidor
        const idx = state.items.findIndex(l => l._optimistic)
        if (idx !== -1) state.items[idx] = action.payload
        else state.items.unshift(action.payload)
      })
      .addCase(createLead.rejected, (state) => {
        // Rollback: sacamos el item optimista
        state.items = state.items.filter(l => !l._optimistic)
        state.error = 'Error al crear el lead'
      })

      // UPDATE
      .addCase(updateLead.rejected, (state, action) => {
        // Rollback: en una app real guardarías el estado previo
        state.error = action.payload?.error || 'Error al actualizar'
      })

      // FETCH
      .addCase(createAsyncThunk('leads/fetchAll', leadsRepository.getAll).fulfilled,
        (state, action) => {
          state.items = action.payload
          state.status = 'succeeded'
        }
      )
  },
})

export const {
  optimisticUpdateLead,
  optimisticDeleteLead,
  optimisticAddLead,
} = leadsSlice.actions

export default leadsSlice.reducer
```

### Ejemplo de uso en componente

```js
// src/components/features/leads/LeadCard.js

import { useDispatch } from 'react-redux'
import { optimisticUpdateLead, updateLead } from '@/store/slices/leadsSlice'

export function LeadCard({ lead }) {
  const dispatch = useDispatch()

  const handleStageChange = async (newStage) => {
    // 1. Actualización optimista — el usuario ve el cambio YA
    dispatch(optimisticUpdateLead({ id: lead.id, changes: { stage: newStage } }))

    // 2. Persistimos en el servidor — si falla, el slice hace rollback
    dispatch(updateLead({ id: lead.id, changes: { stage: newStage } }))
  }

  return (
    <div onClick={() => handleStageChange('qualified')}>
      {lead.name} — {lead.stage}
    </div>
  )
}
```

### Carga Progresiva para Grandes Volúmenes de Datos

Cuando una query puede devolver más de 10.000 registros, **nunca se trae todo junto**. Se usa paginación por lotes (`LIMIT/OFFSET`) de a 1.000 registros. El usuario ve el primer bloque casi instantáneo y el resto se sigue cargando en segundo plano sin que lo note.

**La regla:** si la cantidad de registros esperada puede superar los 10k, implementá carga progresiva desde el día uno.

```js
// src/store/slices/leadsSlice.js

const BATCH_SIZE = 1000

export const fetchLeadsProgressively = () => async (dispatch) => {
  let offset = 0
  let hasMore = true

  dispatch(setStatus('loading'))

  while (hasMore) {
    const batch = await leadsRepository.getAll({ limit: BATCH_SIZE, offset })

    dispatch(appendLeads(batch))       // acumula, no reemplaza
    dispatch(setStatus('succeeded'))   // después del primer batch la UI ya muestra datos

    hasMore = batch.length === BATCH_SIZE  // si vino lleno, probablemente hay más
    offset += BATCH_SIZE
  }

  dispatch(setLoadingComplete(true))
}

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [],
    status: 'idle',
    loadingComplete: false,  // true cuando terminaron TODOS los batches
    error: null,
  },
  reducers: {
    appendLeads(state, action) {
      state.items.push(...action.payload)  // acumula, no reemplaza
    },
    setStatus(state, action) {
      state.status = action.payload
    },
    setLoadingComplete(state, action) {
      state.loadingComplete = action.payload
    },
  },
})

export const { appendLeads, setStatus, setLoadingComplete } = leadsSlice.actions
```

La query en el repositorio con `LIMIT/OFFSET`:

```js
// src/infrastructure/repositories/leadsRepository.js

export const leadsRepository = {
  getAll: async ({ limit = 1000, offset = 0 } = {}) => {
    const leads = await Lead.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })
    return leads.map(l => l.toJSON())
  },
}
```

En el componente, un indicador sutil de que aún hay más datos cargando:

```js
// src/components/features/leads/LeadsList.js

export function LeadsList() {
  const dispatch = useDispatch()
  const { items, status, loadingComplete } = useSelector(s => s.leads)

  useEffect(() => {
    dispatch(fetchLeadsProgressively())
  }, [dispatch])

  if (status === 'idle') return null

  return (
    <>
      {!loadingComplete && (
        <span className="text-xs text-muted-foreground">
          Cargando más registros... ({items.length} hasta ahora)
        </span>
      )}
      {items.map(lead => <LeadCard key={lead.id} lead={lead} />)}
    </>
  )
}
```

> **Tip:** si el dataset tiene inserts frecuentes, usá un `cursor` basado en el `createdAt` del último registro en lugar de `OFFSET` para evitar duplicados o saltos entre batches.

---

### Filtros, Búsqueda y Paginación — Todo Client-Side con Redux

**El back no filtra, no pagina, no busca.** Eso es trabajo del front. Se trae la data una vez (con carga progresiva si es grande), se guarda en el store, y Redux hace todo el resto en memoria. Sin queries extras, sin esperar respuestas, sin loaders molestos — el usuario filtra y ve el resultado instantáneo.

**El ciclo es:**
1. Se trae toda la data al store (una sola vez, o por batches si es grande)
2. Filtros, searchterm y paginación viven en el store como parámetros
3. Los selectores computan la vista filtrada en tiempo real
4. Si se hace un POST/PUT/DELETE → optimistic update → el usuario lo ve ya → en el próximo GET llega confirmado desde el servidor

```js
// src/store/slices/leadsSlice.js

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [],              // todos los leads, la fuente de verdad
    status: 'idle',
    loadingComplete: false,

    // Parámetros de vista — no tocan los datos, solo la presentación
    searchTerm: '',
    filters: {
      stage: null,          // 'nuevo' | 'contactado' | 'calificado' | null = todos
      assignedTo: null,
      dateFrom: null,
      dateTo: null,
    },
    currentPage: 1,
    pageSize: 50,
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
      state.currentPage = 1  // resetear página al buscar
    },
    setFilter(state, action) {
      const { key, value } = action.payload
      state.filters[key] = value
      state.currentPage = 1  // resetear página al filtrar
    },
    clearFilters(state) {
      state.filters = { stage: null, assignedTo: null, dateFrom: null, dateTo: null }
      state.searchTerm = ''
      state.currentPage = 1
    },
    setPage(state, action) {
      state.currentPage = action.payload
    },
    // ... reducers de optimistic update ya definidos arriba
  },
})

export const { setSearchTerm, setFilter, clearFilters, setPage } = leadsSlice.actions
```

Los selectores hacen el trabajo pesado — computar la vista filtrada y paginada a partir de `items`:

```js
// src/store/slices/leadsSlice.js — selectores al final del archivo

export const selectFilteredLeads = (state) => {
  const { items, searchTerm, filters, currentPage, pageSize } = state.leads

  let result = items

  // Búsqueda por texto
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase()
    result = result.filter(l =>
      l.name?.toLowerCase().includes(term) ||
      l.email?.toLowerCase().includes(term) ||
      l.company?.toLowerCase().includes(term)
    )
  }

  // Filtros
  if (filters.stage)      result = result.filter(l => l.stage === filters.stage)
  if (filters.assignedTo) result = result.filter(l => l.assignedTo === filters.assignedTo)
  if (filters.dateFrom)   result = result.filter(l => new Date(l.createdAt) >= new Date(filters.dateFrom))
  if (filters.dateTo)     result = result.filter(l => new Date(l.createdAt) <= new Date(filters.dateTo))

  // Paginación
  const total = result.length
  const totalPages = Math.ceil(total / pageSize)
  const paginated = result.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return { items: paginated, total, totalPages }
}

export const selectLeadsStats = (state) => {
  // Stats siempre sobre el total sin paginar, no sobre la vista actual
  const { items } = state.leads
  return {
    total: items.length,
    byStage: items.reduce((acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1
      return acc
    }, {}),
  }
}
```

Uso en componentes — todo desde el selector, cero lógica en el componente:

```js
// src/components/features/leads/LeadsTable.js

import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredLeads, setSearchTerm, setFilter, setPage } from '@/store/slices/leadsSlice'

export function LeadsTable() {
  const dispatch = useDispatch()
  const { items, total, totalPages } = useSelector(selectFilteredLeads)
  const { searchTerm, filters, currentPage, loadingComplete } = useSelector(s => s.leads)

  return (
    <>
      <input
        value={searchTerm}
        onChange={e => dispatch(setSearchTerm(e.target.value))}
        placeholder="Buscar leads..."
      />

      <select
        value={filters.stage || ''}
        onChange={e => dispatch(setFilter({ key: 'stage', value: e.target.value || null }))}
      >
        <option value="">Todas las etapas</option>
        <option value="nuevo">Nuevo</option>
        <option value="calificado">Calificado</option>
      </select>

      {/* La tabla muestra solo los items de la página actual */}
      {items.map(lead => <LeadRow key={lead.id} lead={lead} />)}

      <Pagination current={currentPage} total={totalPages} onChange={p => dispatch(setPage(p))} />

      {/* Indicador sutil si aún están cargando batches en segundo plano */}
      {!loadingComplete && <span className="text-xs text-muted-foreground">Cargando más... ({total} hasta ahora)</span>}
    </>
  )
}
```

> **Regla de oro:** el back devuelve datos, el front decide cómo mostrarlos. Nunca hagas un request al servidor para filtrar o paginar algo que ya está en el store.

---

### configureStore

```js
// src/store/index.js

import { configureStore } from '@reduxjs/toolkit'
import leadsReducer from './slices/leadsSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    users: usersReducer,
  },
})
```

---

## 🔐 Autenticación — NextAuth v5 + Auth0

> ⚠️ **Auth0 NO es compatible con Next.js 16 de forma directa.** No uses el SDK de Auth0 para Next.js. Usá siempre **NextAuth v5** con Auth0 como OAuth provider.

```js
// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
})

export const { GET, POST } = handlers
```

Variables de entorno requeridas:

```env
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_ISSUER=https://tu-dominio.us.auth0.com
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## 🗄️ Base de Datos

### Supabase + Sequelize (stack preferido)

Supabase provee el PostgreSQL hosteado. Sequelize es el ORM preferido por familiaridad del equipo.

```js
// src/infrastructure/db/sequelize.js

import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }, // Requerido en Supabase
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
})

export default sequelize
```

### Alternativa: Prisma 6.10.0

Si se decide usar Prisma, la versión fijada es `6.10.0`. No actualices sin validar migraciones.

```json
{
  "prisma": "6.10.0",
  "@prisma/client": "6.10.0"
}
```

---

## 🎨 UI — NextUI + Tailwind CSS

NextUI se integra nativamente con Tailwind. Usar los componentes de NextUI como base y extenderlos con clases de Tailwind. No crear componentes de UI desde cero si NextUI ya los tiene.

```js
// Bien ✅
import { Button, Card, Input } from '@nextui-org/react'

// Mal ❌ (no reinventes la rueda)
// <div className="rounded-lg border p-4 shadow"> ... </div>
```

---

## 📝 Política de Commits

Seguimos **Conventional Commits**. Todo commit debe seguir este formato:

```
<tipo>: <descripción en minúsculas y español>
```

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat: agregar filtro por etapa en leads` |
| `fix` | Corrección de bug | `fix: corregir cálculo de días vencidos` |
| `perf` | Mejora de rendimiento | `perf: optimizar query de leads con SQL directo` |
| `refactor` | Refactorización sin cambio funcional | `refactor: extraer lógica de filtros a hooks` |
| `style` | Cambios de estilo/formato | `style: ajustar espaciado en cards mobiles` |
| `docs` | Documentación | `docs: agregar guía de usuario` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |
| `test` | Tests | `test: agregar tests para API de leads` |
| `build` | Cambios de build/deploy | `build: configurar variables de Vercel` |

### Reglas adicionales

- Un commit = una cosa. No mezcles feat con fix en el mismo commit.
- Descripción en **español**, en **minúsculas**, sin punto final.
- Si el cambio rompe compatibilidad: agregá `!` → `feat!: rediseño de API de leads`.

---

## ⚠️ Cosas que te van a romper el proyecto si no las sabés

> Sí, esta sección existe porque alguien (o varios) ya pisaron estas minas. Aprendé de los caídos.

### pnpm + Next.js 16 — Por qué NO lo usamos

**Este proyecto no usa `pnpm`. No lo instales, no lo propongas, no lo "probés a ver".** `pnpm` no es compatible con Next.js 16 y rompe el deploy en Vercel de formas creativas y dolorosas.

> Si llegaste acá porque alguien (quizás vos) ya usó `pnpm` y ahora tenés errores raros de módulos que no tienen ningún sentido a primera vista... bienvenido al club.
>
> **Opción A — la correcta: migrá a npm**
> ```bash
> rm -rf node_modules .next pnpm-lock.yaml
> npm install
> npm run dev
> ```
>
> **Opción B — si por alguna razón no podés migrar ahora mismo:**
> `pnpm` con Next.js 16 + Turbopack **requiere** `node-linker=hoisted` en el `.npmrc`. Sin eso, Turbopack no resuelve los módulos nativos y te tira errores de imports que no tienen ningún sentido a primera vista. Creá o editá el `.npmrc` en la raíz con esto:
> ```
> node-linker=hoisted
> ```
> Después: `rm -rf node_modules .next && pnpm install`. Esto no es la solución — es el parche. La solución es la opción A.

### No uses alias `@/` — usá imports relativos

Next.js 16 con Turbopack **no soporta correctamente los alias de importación** (`@/`). Todos los imports tienen que ser relativos:

```js
// ❌ Esto rompe con Turbopack
import { LeadCard } from '@/components/features/leads/LeadCard'
import { leadsSlice } from '@/store/slices/leadsSlice'

// ✅ Así se hace en este proyecto
import { LeadCard } from '../../components/features/leads/LeadCard'
import { leadsSlice } from '../../../store/slices/leadsSlice'
```

Sí, es un embole. Sí, los imports quedan más feos. Pero es lo que hay hasta que Next.js lo soporte bien. La alternativa es pasar una tarde debuggeando un "Module not found" que no tiene nada que ver con el módulo en sí.

### Limpieza de entorno cuando algo no cierra

Si tenés errores de resolución de módulos o algo que "debería funcionar" no funciona:

```bash
# El clásico "apagar y prender"
rm -rf node_modules .next
npm install
npm run dev
```

Esto resuelve el 90% de los casos. Antes de abrir un issue o pedirle ayuda a alguien, probá esto primero.

### Deploy en Vercel — Caché que no se limpia sola

Si deployás y algo falla raro después de cambiar dependencias o mover archivos:

1. Ir a Vercel → el proyecto → **Deployments**
2. Agarrar el último deploy → **Redeploy**
3. Tildar **"Clear build cache"** — este paso es el importante
4. Confirmar

Sin limpiar el caché, Vercel puede estar usando una versión vieja de `node_modules` o de los archivos compilados, y el error que ves no tiene nada que ver con tu código actual.

---

## 🚀 Deploy

### Frontend — Vercel

- Conectar repo de GitHub directamente.
- Variables de entorno se configuran en el panel de Vercel.
- El script de build incluye generación de Prisma si se usa: `prisma generate && next build`.
- **Package manager: `npm`. Solo `npm`.** Este proyecto **no usa `pnpm`** — no es compatible con Next.js 16 y rompe el deploy. Si estás viendo errores raros de dependencias y alguien usó `pnpm`... ahí está tu problema. Ver sección "Cosas que te van a romper el proyecto".
- En Vercel, si cambiás dependencias o la estructura de imports, hacé **Redeploy → "Clear build cache"** o te va a romper sin razón aparente y vas a perder una hora debuggeando algo que no es código.

### Backend / API separada — Railway o Render

- Ambos soportan deploy desde GitHub con auto-deploy en push a `main`.
- Configurar variables de entorno en el panel correspondiente.
- Railway es preferido para servicios que necesitan más control de recursos.
- Render es buena opción para servicios más simples o con menor carga.

---

## 🌍 Variables de Entorno

Nunca commitear `.env`. El archivo `.env.example` debe mantenerse actualizado con todas las keys (sin valores).

```env
# Base de datos
DATABASE_URL=

# Auth
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_ISSUER=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NODE_ENV=development
```

---

## ✅ Checklist antes de hacer PR

- [ ] El código no rompe el build (`npm run build`)
- [ ] No hay imports con alias `@/` — todos los imports son relativos
- [ ] El commit sigue la política de commits
- [ ] No hay `console.log` en producción
- [ ] Las variables de entorno nuevas están en `.env.example`
- [ ] Los optimistic updates tienen su rollback implementado
- [ ] No hay lógica de negocio en los componentes (va en hooks o en el dominio)
- [ ] Los slices nuevos están registrados en `store/index.js`
- [ ] Ningún componente supera las ~150 líneas
- [ ] No hay código duplicado — si algo se repite, está abstraído
- [ ] No hay `NEXT_PUBLIC_` exponiendo datos sensibles
- [ ] No hay credenciales hardcodeadas ni en comentarios
- [ ] El glosario y el estado del proyecto están actualizados si hubo cambios de dominio
- [ ] Todo DELETE pasa por `ConfirmDialog` antes de ejecutarse
- [ ] Los thunks usan `rejectWithValue` — el middleware global muestra el toast de error
- [ ] Los selectores que filtran o calculan usan `createSelector`
- [ ] No hay lógica de permisos o data sensible expuesta en el store

---

## 🔒 Seguridad y Datos Sensibles

Estas reglas no son opcionales. Un error acá puede exponer datos de usuarios o credenciales de producción.

**Variables de entorno:**
- Nunca commitear `.env`, `.env.local` ni ningún archivo con credenciales reales. Están en `.gitignore` y así se quedan.
- Mantener `.env.example` siempre actualizado con las keys pero sin valores.
- Si una key se expuso por accidente en un commit: rotarla inmediatamente, no alcanza con borrarla del historial.

**`NEXT_PUBLIC_` = público en el browser:**
- Todo lo que empieza con `NEXT_PUBLIC_` es visible para cualquier usuario que inspeccione el bundle. Solo va ahí lo que está bien que sea público (URL de Supabase, por ejemplo).
- La `SUPABASE_SERVICE_ROLE_KEY` NUNCA va al cliente. Solo se usa server-side (Route Handlers, server components, scripts).

**En el código:**
- Cero hardcodeo de keys, tokens, passwords o URLs de producción en el código fuente.
- Cero credenciales en comentarios, logs ni mensajes de error que lleguen al cliente.
- Los `console.log` con data de usuarios o responses de APIs se sacan antes del PR.

```js
// ❌ MAL — nunca esto
const client = createClient('https://xyz.supabase.co', 'eyJhbGc...service-role-key')

// ✅ BIEN — siempre desde env
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // solo en server-side
)
```

---

## 🏛️ Principios de Código — SOLID + Modularización

Estas son las reglas de calidad del proyecto. No se negocian en el PR.

### S — Single Responsibility
Un archivo, una responsabilidad. Un componente muestra cosas. Un hook maneja lógica. Un slice maneja estado. Un repositorio habla con la DB. Si un archivo hace dos cosas, se parte.

### O — Open/Closed
Extendé comportamiento agregando código, no modificando el existente. Usá props, composición y hooks para extender componentes sin tocar su interior.

### L — Liskov Substitution
Los componentes hijos deben poder reemplazar al padre sin romper nada. Si un componente especializado no puede usarse donde va el genérico, está mal diseñado.

### I — Interface Segregation
No forzar a un componente o función a recibir props/parámetros que no usa. Props pequeñas y específicas, no un objeto gigante con todo adentro.

### D — Dependency Inversion
Los componentes y la lógica de negocio no dependen de implementaciones concretas. Dependen de abstracciones (repositorios, hooks, servicios). Así se puede cambiar Sequelize por Prisma sin tocar los componentes.

### Reglas duras de modularización

- **Componentes: máximo ~150 líneas.** Si crece más, es señal de que tiene más de una responsabilidad. Se extrae.
- **Funciones: máximo ~30 líneas.** Si es más larga, se divide.
- **Cero código duplicado.** Antes de escribir algo, buscá si ya existe. Si se repite dos veces, se abstrae en hook, util o componente.
- **Reutilizar siempre sobre reinventar.** Un componente `<DataTable />` genérico vale más que cinco tablas distintas que hacen lo mismo.

```js
// ❌ MAL — componente que hace todo
export function LeadsPage() {
  // 50 líneas de fetch
  // 80 líneas de filtros
  // 200 líneas de tabla
  // 100 líneas de modal de edición
}

// ✅ BIEN — cada cosa en su lugar
export function LeadsPage() {
  return (
    <>
      <LeadsFilters />
      <LeadsTable />
      <EditLeadModal />
    </>
  )
}
// Cada componente en su propio archivo, con su propia lógica encapsulada en hooks
```

```js
// ❌ MAL — lógica repetida en cada componente
function LeadsTable() {
  const [data, setData] = useState([])
  useEffect(() => { fetch('/api/leads').then(...) }, [])
}

function LeadsSummary() {
  const [data, setData] = useState([])
  useEffect(() => { fetch('/api/leads').then(...) }, [])  // mismo código de nuevo
}

// ✅ BIEN — lógica extraída y reutilizada
function useLeads() {
  // toda la lógica acá, una sola vez
}

function LeadsTable() { const { items } = useLeads() }
function LeadsSummary() { const { items } = useLeads() }
```

---

## 💻 Setup Local

Pasos para correr el proyecto desde cero. Actualizar si cambia algo.

```bash
# 1. Clonar el repo
git clone <url-del-repo>
cd <nombre-del-proyecto>

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completar los valores en .env.local

# 4. Correr el proyecto
npm run dev
```

> ⚠️ **Si tenés errores de "Module not found" o imports raros:** borrá `node_modules` y `.next` y volvé a correr `npm install`. El 90% de los problemas de resolución de módulos se arreglan con eso.

### Comandos útiles del día a día

```bash
npm run dev                  # Servidor de desarrollo con Turbopack
npm run build                # Build de producción
npm run lint                 # Linter

# Sequelize
npm run db:migrate           # Correr migraciones pendientes
npm run db:migrate:undo      # Revertir última migración
npm run db:seed              # Correr seeders

# Si se usa Prisma
npm run db:studio            # Abrir Prisma Studio (GUI de la DB)
npm run db:generate          # Regenerar cliente de Prisma
npm run db:migrate           # Correr migraciones
```

> Si necesitás acceso a la DB de producción o staging, pedíle las credenciales a quien corresponda. No se comparten por Slack ni WhatsApp, se pasan por un gestor de secretos.

---

## 📖 Glosario del Proyecto

> Completar con los términos específicos del negocio a medida que aparecen. Cuando una IA o dev nuevo lee esto, entiende el dominio sin preguntar.

| Término | Significado en este proyecto |
|---------|----------------------------|
| `Lead` | Potencial cliente en el pipeline de ventas |
| `Etapa` | Estado del lead en el pipeline (ej: nuevo, contactado, calificado, cerrado) |
| `Pipeline` | Flujo completo de etapas por las que pasa un lead |
| *(agregar más)* | *(descripción)* |

### Convenciones de Naming

| Qué | Convención | Ejemplo |
|-----|-----------|---------|
| Componentes | PascalCase | `LeadCard.jsx` |
| Hooks | camelCase con `use` | `useLeads.js` |
| Slices | camelCase con `Slice` | `leadsSlice.js` |
| Repositorios | camelCase con `Repository` | `leadsRepository.js` |
| Utilidades | camelCase | `formatDate.js` |
| Constantes | UPPER_SNAKE_CASE | `BATCH_SIZE` |
| Carpetas | kebab-case | `lead-details/` |
| Variables/funciones | camelCase | `fetchLeads()` |

---

## ⚙️ Middleware Global de Errores

Sin esto, cada slice maneja los errores como quiere. Con esto, hay un solo lugar que escucha todos los `rejected` del proyecto y muestra el toast correspondiente. Si mañana cambiás Sonner por otra cosa, lo cambiás acá y listo — no tocás 50 archivos.

```js
// src/store/middleware/errorMiddleware.js

import { isRejected } from '@reduxjs/toolkit'
import { toast } from 'sonner'

// Mensajes por tipo de acción — personalizá según el proyecto
const ERROR_MESSAGES = {
  'leads/create':  'No se pudo crear el registro',
  'leads/update':  'No se pudo actualizar el registro',
  'leads/delete':  'No se pudo eliminar el registro',
  'users/update':  'No se pudo actualizar el usuario',
  // si no hay mensaje específico, cae al genérico de abajo
}

export const errorMiddleware = () => next => action => {
  if (isRejected(action)) {
    const message =
      ERROR_MESSAGES[action.type.replace('/rejected', '')] ??
      action.payload ??
      'Algo salió mal. Intentá de nuevo.'

    toast.error(message)

    // Log para debugging en desarrollo — en producción podría ir a Sentry, Datadog, etc.
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Redux Error] ${action.type}:`, action.payload)
    }
  }

  return next(action)
}
```

Se registra una sola vez en el store:

```js
// src/store/index.js

import { configureStore } from '@reduxjs/toolkit'
import { errorMiddleware } from './middleware/errorMiddleware'
import leadsReducer from './slices/leadsSlice'

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware),
})
```

Con esto en su lugar, **los thunks ya no necesitan `toast.error` adentro** — solo hacen `rejectWithValue(err.message)` y el middleware se encarga del resto. Los slices quedan limpios.

```js
// Thunk limpio — sin toast, sin manejo de error local
export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData, { rejectWithValue }) => {
    try {
      return await leadsRepository.create(leadData)
    } catch (err) {
      return rejectWithValue(err.message)  // el middleware muestra el toast
    }
  }
)
```

> El toast de **éxito** sí va en el thunk o en el `fulfilled` del slice — el middleware solo maneja errores. Separación clara: éxito es específico de cada acción, error es global.

---

## 🎯 Cuándo SÍ ir al Servidor

El front maneja todo lo que ya está en el store. Pero hay casos donde el servidor es obligatorio:

**Siempre van al servidor:**
- `POST` → crear un registro
- `PUT / PATCH` → modificar un registro
- `DELETE` → eliminar un registro
- Autenticación y autorización — cualquier validación de permisos

**Van al servidor aunque el front "podría" hacerlo:**
- **Data que no debe bajar completa al cliente** — si tenés registros que el usuario actual no debería ver (ej: leads de otros vendedores, registros de otros tenants en una app multi-tenant), esos no bajan al store. El servidor filtra por permisos antes de responder. Un usuario puede abrir Redux DevTools y ver todo lo que está en el store.
- **Cálculos sobre volúmenes enormes** — reportes, exportaciones, agregaciones sobre cientos de miles de registros. Eso no se hace en el browser, se pide al servidor que lo procese y devuelva el resultado.
- **Operaciones que requieren consistencia garantizada** — si dos usuarios pueden modificar el mismo registro al mismo tiempo, la lógica de conflicto vive en el servidor, no en el cliente.

```
Regla práctica:
¿Alguien que no debería ver este dato podría verlo si está en el store? → va al servidor
¿Esta operación modifica algo en la DB? → va al servidor
¿Este cálculo puede hacer lag en el browser con datos reales? → va al servidor
Todo lo demás → store, client-side, instantáneo
```

---

## 🧠 Selectores Memoizados con `createSelector`

`useSelector` corre el selector cada vez que el store cambia — cualquier slice, cualquier acción. Si `selectFilteredLeads` filtra y pagina sobre 10.000 items, eso es caro y se ejecuta más de lo necesario.

`createSelector` (incluido en RTK, no hay que instalar nada extra) memoiza el resultado: si los inputs no cambiaron, devuelve el resultado cacheado sin recalcular nada.

```js
// src/store/slices/leadsSlice.js

import { createSelector } from '@reduxjs/toolkit'

// Selectores base — extraen partes del estado, son baratos
const selectAllLeads    = state => state.leads.items
const selectSearchTerm  = state => state.leads.searchTerm
const selectFilters     = state => state.leads.filters
const selectCurrentPage = state => state.leads.currentPage
const selectPageSize    = state => state.leads.pageSize

// Selector memoizado — solo recalcula si alguno de los inputs cambió
export const selectFilteredLeads = createSelector(
  [selectAllLeads, selectSearchTerm, selectFilters, selectCurrentPage, selectPageSize],
  (items, searchTerm, filters, currentPage, pageSize) => {

    let result = items

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(l =>
        l.name?.toLowerCase().includes(term) ||
        l.email?.toLowerCase().includes(term) ||
        l.company?.toLowerCase().includes(term)
      )
    }

    if (filters.stage)      result = result.filter(l => l.stage === filters.stage)
    if (filters.assignedTo) result = result.filter(l => l.assignedTo === filters.assignedTo)
    if (filters.dateFrom)   result = result.filter(l => new Date(l.createdAt) >= new Date(filters.dateFrom))
    if (filters.dateTo)     result = result.filter(l => new Date(l.createdAt) <= new Date(filters.dateTo))

    const total      = result.length
    const totalPages = Math.ceil(total / pageSize)
    const paginated  = result.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    return { items: paginated, total, totalPages }
  }
)

// Stats también memoizadas — siempre sobre el total sin filtrar
export const selectLeadsStats = createSelector(
  [selectAllLeads],
  (items) => ({
    total: items.length,
    byStage: items.reduce((acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1
      return acc
    }, {}),
  })
)
```

En el componente no cambia nada — misma llamada de siempre, pero ahora es gratis si los datos no cambiaron:

```js
const { items, total, totalPages } = useSelector(selectFilteredLeads)
```

> **Regla:** todo selector que haga más que leer una propiedad directa del estado (`state.leads.items`) debería usar `createSelector`. Filtros, maps, reduces, cálculos — todos memoizados.

---

## 🔔 Manejo de Errores y Feedback al Usuario

### Regla general

Toda acción que el usuario dispara necesita feedback. El usuario nunca debe quedarse preguntándose si algo funcionó o no. Se usa **Sonner** (ya en el stack) para todos los toasts — es liviano, se integra con Next y no requiere configuración compleja.

**Tres estados que siempre hay que cubrir:**
- ✅ **Éxito** → toast verde, mensaje claro y corto
- ❌ **Error** → toast rojo, mensaje que explique qué pasó
- ⏳ **Loading** → solo si la operación tarda más de lo inmediato (optimistic updates no necesitan loader)

### Setup global de Sonner

```js
// app/layout.js

import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
```

### Toasts en los thunks

Los toasts van en el thunk, no en el componente. El componente no sabe si salió bien o mal — eso es responsabilidad de la capa de estado.

```js
// src/store/slices/leadsSlice.js

import { toast } from 'sonner'

export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData, { rejectWithValue }) => {
    try {
      const created = await leadsRepository.create(leadData)
      toast.success('Lead creado correctamente')
      return created
    } catch (err) {
      toast.error('No se pudo crear el lead. Intentá de nuevo.')
      return rejectWithValue(err.message)
    }
  }
)

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const updated = await leadsRepository.update(id, changes)
      toast.success('Lead actualizado')
      return updated
    } catch (err) {
      toast.error('Error al actualizar. Los cambios fueron revertidos.')
      return rejectWithValue({ id, error: err.message })
    }
  }
)

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id, { rejectWithValue }) => {
    try {
      await leadsRepository.delete(id)
      toast.success('Lead eliminado')
      return id
    } catch (err) {
      toast.error('No se pudo eliminar. El registro fue restaurado.')
      return rejectWithValue(id)
    }
  }
)
```

### Confirmación obligatoria antes de cualquier DELETE

**Toda acción destructiva requiere confirmación del usuario.** Sin excepciones. No importa si es un lead, un archivo, un usuario o cualquier registro — si se borra, primero se confirma.

Se usa un componente reutilizable `<ConfirmDialog />` para estandarizar el comportamiento en todo el proyecto:

```js
// src/components/ui/ConfirmDialog.js

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function ConfirmDialog({ trigger, title, description, onConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? '¿Estás seguro?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? 'Esta acción no se puede deshacer.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

Uso — el delete nunca se llama directo, siempre pasa por el dialog:

```js
// src/components/features/leads/LeadRow.js

import { useDispatch } from 'react-redux'
import { optimisticDeleteLead, deleteLead } from '@/store/slices/leadsSlice'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function LeadRow({ lead }) {
  const dispatch = useDispatch()

  const handleDelete = () => {
    // Optimistic: lo sacamos ya de la vista
    dispatch(optimisticDeleteLead(lead.id))
    // Persistimos — si falla, el slice lo restaura y muestra toast de error
    dispatch(deleteLead(lead.id))
  }

  return (
    <div>
      <span>{lead.name}</span>

      <ConfirmDialog
        trigger={<button>Eliminar</button>}
        title="¿Eliminar este lead?"
        description={`Se eliminará "${lead.name}" permanentemente. Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
```

> **Regla:** si la acción borra, desactiva o modifica algo irreversible → `ConfirmDialog` siempre. El optimistic update en deletes igual aplica — se saca de la vista inmediatamente después de confirmar, y se restaura solo si el servidor falla.

---

## 🚫 Antipatrones — Qué NO hacer

Cosas que se intentaron, generan deuda técnica, o están explícitamente prohibidas en este proyecto.

- **No uses TypeScript.** El proyecto es JavaScript. Si una librería trae tipos, ignoralos.
- **No uses alias `@/` en imports.** Next.js 16 + Turbopack no los soporta — usá imports relativos siempre. Sí, son más largos. Sí, es un embole. Pero funciona.
- **No uses `pnpm` ni `yarn`.** El proyecto usa `npm`. `pnpm` no es compatible con Next.js 16. Mezclar package managers corrompe el lockfile y te puede romper el deploy de formas no obvias.
- **No traigas datos directamente en los componentes** con `fetch` o llamadas a la DB. Todo pasa por el store o por un hook que usa el store.
- **No pongas lógica de negocio en los componentes.** Los componentes renderizan. La lógica va en hooks, use-cases o el dominio.
- **No crees un componente nuevo si ya existe uno** que hace lo mismo o algo similar. Extendé el existente.
- **No hagas un componente de más de ~150 líneas** sin antes intentar dividirlo.
- **No uses el SDK directo de Auth0 para Next.js.** Usa NextAuth v5 con Auth0 como provider (incompatibilidad conocida con Next 16).
- **No expongas la `SUPABASE_SERVICE_ROLE_KEY` en el cliente** bajo ninguna circunstancia.
- **No commitees con el mensaje `fix`, `update` o `cambios`.** La política de commits existe por algo.
- **No acumules `console.log`** de debug en el código. Si lo pusiste para debuggear, lo sacás antes del commit.
- **No dupliques código.** Si lo escribiste dos veces, la tercera lo abstraés.
- **No ejecutes un DELETE sin confirmación del usuario.** Siempre `ConfirmDialog`. Sin excepciones.
- **No manejes errores en el componente.** Los toasts y el rollback van en el thunk, el middleware global hace el resto.
- **No dejes una acción sin feedback.** Si algo salió bien o mal, el usuario tiene que saberlo.
- **No pongas `toast.error` en cada thunk.** Para eso existe el middleware global — un solo lugar, consistencia garantizada.
- **No uses `useSelector` con lógica de filtrado sin `createSelector`.** Si el selector calcula algo, se memoiza.
- **No bajes al store data que un usuario no debería ver.** El servidor filtra por permisos, el cliente muestra.

---

## 📍 Estado Actual del Proyecto

> ⚠️ **Esta sección es obligatoria mantenerla actualizada.** Es lo primero que lee una IA o un dev nuevo para entender dónde está parado el proyecto. Sin contexto fresco, se pierde tiempo explicando lo que ya está hecho.

### 🗂️ Estructura real del proyecto

```
/ (actualizar con la estructura real a medida que crece)
```

### ✅ Hecho

> Ir agregando con fecha. Un renglón por ítem, sin explayarse.

```
- [YYYY-MM-DD] Inicializado proyecto con Next.js 16 + Redux Toolkit
- [YYYY-MM-DD] Configurado NextAuth v5 con Auth0 como provider
- [YYYY-MM-DD] Conectado Supabase con Sequelize
- [YYYY-MM-DD] Implementado slice de leads con optimistic updates
```

### 🔄 En progreso

```
- [Quién] Qué está haciendo
  ej: [Juan] Implementando carga progresiva de leads por batches
```

### ⏳ Pendiente

```
- [ ] Descripción del pendiente — agregar contexto si es complejo
- [ ] ...
```

### 🐛 Bugs conocidos / Workarounds activos

```
- Auth0 no compatible con Next 16 directo → usar NextAuth v5 como wrapper (ya implementado)
- Agregar acá cualquier comportamiento raro conocido para no perder tiempo debuggeando lo mismo dos veces
```

### 📌 Decisiones tomadas

```
- [YYYY-MM-DD] Se eligió Sequelize sobre Prisma por familiaridad del equipo
- [YYYY-MM-DD] Se prefirió SSR con Next en lugar de backend separado por ser MVP
- [YYYY-MM-DD] Agregar acá cualquier decisión que alguien pueda cuestionar en el futuro
```

---

## 🧠 Mantené este README actualizado — para humanos y para IA

Este archivo es el **contexto principal del proyecto**. Tanto un desarrollador nuevo como una IA (Claude, Copilot, etc.) van a leer esto primero para entender qué hay, cómo está hecho y qué decisiones se tomaron.

**Cuanto más actualizado esté, menos tokens se gastan explicando contexto en cada conversación.** Eso ahorra plata y tiempo.

### Qué actualizar y cuándo

- **Cambiaste el stack o agregaste una librería** → actualizá la tabla de tecnologías.
- **Tomaste una decisión de arquitectura** → dejá una nota con el motivo. "Decidimos separar el backend porque..." vale oro tres meses después.
- **Hay un workaround o incompatibilidad conocida** → documentala como se hizo con Auth0 + Next 16. Así no se repite el error.
- **Cambiaron las variables de entorno** → actualizá `.env.example` y la sección correspondiente acá.
- **Surgió una convención nueva** → agregala. Si el equipo decidió algo, va acá.

### Formato sugerido para el historial de decisiones

Al final del README podés ir acumulando un log liviano de decisiones importantes:

```
## 📌 Decisiones tomadas

- 2025-01-10: Se eligió Sequelize sobre Prisma por familiaridad del equipo.
- 2025-01-15: Se separó el backend a Railway porque la lógica de negocio creció demasiado para las Route Handlers de Next.
- 2025-02-01: Se migró de NextUI a shadcn/ui por mejor compatibilidad con Tailwind v4.
```

No hace falta que sea exhaustivo. Solo los cambios que alguien podría preguntarse "¿por qué hicieron esto?" semanas después.

> **Regla simple:** si tuviste que explicarle algo del proyecto a alguien (humano o IA), ese algo debería estar viendo este README. (o jodiste el README)
