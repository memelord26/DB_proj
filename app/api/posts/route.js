import { NextResponse } from "next/server"
import supabase from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = (searchParams.get('search') || '').trim()

    let query = supabase.from('movie_table').select('*')

    // Only apply search filters if there's actually a search term
    if (search && search.length > 0) {
      // Check if search term is a number (potential year)
      const isYear = /^\d{4}$/.test(search)
      
      if (isYear) {
        // If it's a 4-digit year, search in all three fields
        query = query.or(`Actor_Name.ilike.%${search}%,Movie_Name.ilike.%${search}%,Release_Date.eq.${parseInt(search)}`)
      } else {
        // If it's text, only search in Actor_Name and Movie_Name
        query = query.or(`Actor_Name.ilike.%${search}%,Movie_Name.ilike.%${search}%`)
      }
    }
    // If search is empty, return all data (no filters applied)

    const { data: posts, error } = await query

    console.log("Supabase returned posts:", posts)

    if (error) throw error

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
