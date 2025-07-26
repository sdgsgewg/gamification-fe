import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://acctihmbqsiftxmlcygv.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY! // pakai anon key di frontend
export const supabase = createClient(supabaseUrl, supabaseKey)
