import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const ADMIN_ROLL_NO = '6568'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
