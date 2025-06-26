import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, username, password } = await req.json();

  try {
    const { data: existingUsers, error: selectError } = await supabase
      .from('accounts')
      .select('username')
      .eq('username', username)
      .limit(1);

    if (selectError) {
      console.error('Supabase username check error:', selectError.message);
      return NextResponse.json({ error: 'Database error checking username uniqueness' }, { status: 500 });
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const { data: existingEmails, error: emailCheckError } = await supabase
      .from('accounts')
      .select('email')
      .eq('email', email)
      .limit(1);

    if (emailCheckError) {
      console.error('Supabase email check error:', emailCheckError.message);
      return NextResponse.json({ error: 'Database error checking email uniqueness' }, { status: 500 });
    }

    if (existingEmails && existingEmails.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase
      .from('accounts')
      .insert({
        email: email,
        username: username,
        password: hashedPassword,
      });

    if (insertError) {
      console.error('Supabase user insertion error:', insertError.message);
      return NextResponse.json({ error: insertError.message || "Failed to register user" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error('General registration error:', err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}