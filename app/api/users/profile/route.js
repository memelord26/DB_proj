import { NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  const { userId, newEmail, newPassword, currentPassword } = await req.json();

  try {
    if (!userId || !currentPassword) {
      return NextResponse.json({ error: 'User ID and current password are required' }, { status: 400 });
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
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const updateData = {};

    if (newEmail && newEmail !== user.email) {
      const { data: emailExists, error: emailCheckError } = await supabase
        .from('accounts')
        .select('email')
        .eq('email', newEmail)
        .neq('id', userId)
        .limit(1);

      if (emailCheckError) {
        console.error('Supabase email check error:', emailCheckError.message);
        return NextResponse.json({ error: 'Database error checking email' }, { status: 500 });
      }

      if (emailExists && emailExists.length > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }

      updateData.email = newEmail;
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes to update' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', userId);

    if (updateError) {
      console.error('Supabase update error:', updateError.message);
      return NextResponse.json({ error: updateError.message || 'Database error updating profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });

  } catch (err) {
    console.error('General update profile error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
