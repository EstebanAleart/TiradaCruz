import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

// Cliente servidor — usa service key para bypassear RLS
export const supabase = createClient(url, serviceKey)

// Cliente público — para operaciones sin privilegios
export const supabasePublic = createClient(
  url,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)
