import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function DELETE(request) {
  const { userId, password } = await request.json()

  try {
    if (!userId || !password) {
      return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('starsearch')
    const accounts = db.collection('accounts')

    // Find user by ID
    const user = await accounts.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 401 })
    }

    const result = await accounts.deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully' })

  } catch (error) {
    console.error('General delete account error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
