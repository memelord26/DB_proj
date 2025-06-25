import {createClient} from '@supabase/supabase-js'


const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseURL, supabaseKey)

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Supabase Key present?", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

export default supabase