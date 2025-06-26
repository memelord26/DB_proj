import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request) {
  const { email, username, newPassword } = await request.json()

  try {
    if (!email || !username || !newPassword) {
      return NextResponse.json({ error: 'Email, username, and new password are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('starsearch')
    const accounts = db.collection('accounts')

    // Find user by email and username
    const user = await accounts.findOne({ email, username })

    if (!user) {
      return NextResponse.json({ error: 'No account found with the provided email and username combination' }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const result = await accounts.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Password reset successfully' })

  } catch (error) {
    console.error('General forgot password error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
