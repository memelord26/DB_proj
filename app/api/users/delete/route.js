import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function DELETE(req) {
  const { userId, password } = await req.json();

  try {
    if (!userId || !password) {
      return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 });
    }

    const { data: users, error: selectError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', userId)
      .limit(1);

    if (selectError) {
      console.error('Supabase user read error:', selectError.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 401 });
    }

    const { error: deleteError } = await supabase
      .from('accounts')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError.message);
      return NextResponse.json({ error: deleteError.message || 'Database error deleting account' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });

  } catch (err) {
    console.error('General delete account error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
