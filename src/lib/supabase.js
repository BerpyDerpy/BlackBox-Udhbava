import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fdhthsgpoeedztydwxai.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkaHRoc2dwb2VlZHp0eWR3eGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDc4MjMsImV4cCI6MjA4NjM4MzgyM30.ZX43HOyBNZDpbrxTnpGl7rruu8ngVwVzQMehnDqysJI'

export const ADMIN_ROLL_NO = '6568'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
