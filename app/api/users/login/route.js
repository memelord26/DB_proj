import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const { data: users, error: selectError } = await supabase
      .from('accounts')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (selectError) {
      console.error('Supabase accounts table query error:', selectError.message);
      return NextResponse.json({ error: 'Database error during login' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Login POST handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}