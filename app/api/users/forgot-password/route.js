import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, username, newPassword } = await req.json();

  try {
    // Validate that both email and username are provided
    if (!email || !username || !newPassword) {
      return NextResponse.json({ error: 'Email, username, and new password are required' }, { status: 400 });
    }

    // Check if user exists with matching email and username
    const { data: users, error: selectError } = await supabase
      .from('accounts')
      .select('*')
      .eq('email', email)
      .eq('username', username)
      .limit(1);

    if (selectError) {
      console.error('Supabase accounts table query error:', selectError.message);
      return NextResponse.json({ error: 'Database error during password reset' }, { status: 500 });
    }

    // If no user found with matching email and username
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'No account found with the provided email and username combination' }, { status: 404 });
    }

    const user = users[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ password: hashedPassword })
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase password update error:', updateError.message);
      return NextResponse.json({ error: 'Database error updating password' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Forgot password POST handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
