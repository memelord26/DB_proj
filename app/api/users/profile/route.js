import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function PUT(request) {
  const { userId, newEmail, newPassword, currentPassword } = await request.json()

  try {
    if (!userId || !currentPassword) {
      return NextResponse.json({ error: 'User ID and current password are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('starsearch')
    const accounts = db.collection('accounts')

    // Find user by ID
    const user = await accounts.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const updateData = { updatedAt: new Date() }

    if (newEmail && newEmail !== user.email) {
      // Check if email already exists
      const emailExists = await accounts.findOne({ 
        email: newEmail, 
        _id: { $ne: new ObjectId(userId) } 
      })

      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }

      updateData.email = newEmail
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updateData.password = hashedPassword
    }

    if (Object.keys(updateData).length === 1) { // Only updatedAt
      return NextResponse.json({ error: 'No changes to update' }, { status: 400 })
    }

    const result = await accounts.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' })

  } catch (error) {
    console.error('General profile update error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
