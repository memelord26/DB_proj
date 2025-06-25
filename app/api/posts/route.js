import { NextResponse } from "next/server"
import supabase from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = (searchParams.get('search') || '').trim()

    let query = supabase.from('movie_table').select('*')

    if (search) {
      // Use filter() for case-sensitive column names
      query = query.filter('Actor_Name', 'ilike', `%${search}%`)
    }

    const { data: posts, error } = await query

    console.log("Supabase returned posts:", posts)

    if (error) throw error

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
