import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request) {
  const { username, password } = await request.json()

  try {
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('starsearch')
    const accounts = db.collection('accounts')

    // Find user by username
    const user = await accounts.findOne({ username })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      }
    })

  } catch (error) {
    console.error('General verify user error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
