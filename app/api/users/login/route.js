import { createUsersConnection } from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req) {
    const { username, password } = await req.json()

    try{
        const db = await createUsersConnection()
        const [users] = await db.query('SELECT * FROM accounts WHERE username = ?', [username])

        if (users.length === 0) {
            return NextResponse.json({error: "User not found"}, { status: 404 })
        }

        const user = users[0]
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password"}, { status: 401 })
        }

        return NextResponse.json({success: true, user: { id: user.id, username: user.username } })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}