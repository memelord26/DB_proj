import { createUsersConnection } from "@/lib/sqldb"
import bcrypt from "bcrypt";
import { NextResponse } from "next/server"

export async function POST(req) {
    const { email, username, password } = await req.json();

    try{
        const db = await createUsersConnection()

        const [userExists] = await db.query('SELECT * FROM accounts WHERE username = ?', [username])
        if (userExists.length > 0) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO accounts (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        )

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}