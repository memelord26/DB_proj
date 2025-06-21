import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const db = await createConnection()

    // Extract search query from URL
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Use parameterized query to prevent SQL injection
    const sql = search
      ? "SELECT * FROM actor_agency WHERE ActorAgencyID = ?"
      : "SELECT * FROM actor_agency"

    const values = search ? [`${search}`] : []

    const [posts] = await db.query(sql, values)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}