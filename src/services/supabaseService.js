import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test-Query
export const testConnection = async () => {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .limit(1)

  if (error) throw error
  return data
}