import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const { data: users, error: selectError } = await supabase
      .from('accounts')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (selectError) {
      console.error('Supabase verification error:', selectError.message);
      return NextResponse.json({ error: 'Database error during verification' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (err) {
    console.error('General verify user error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
