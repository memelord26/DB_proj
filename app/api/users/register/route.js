import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request) {
  const { email, username, password } = await request.json()

  try {
    const client = await clientPromise
    const db = client.db('starsearch')
    const accounts = db.collection('accounts')

    // Check if username exists
    const existingUser = await accounts.findOne({ username })

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Check if email exists
    const existingEmail = await accounts.findOne({ email })

    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user document
    const result = await accounts.insertOne({
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (!result.insertedId) {
      return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User registered successfully" })

  } catch (error) {
    console.error('General registration error:', error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}