import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { login, password } = await req.json();

    const [users] = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE login = ?', 
      [login]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' }, 
        { status: 401 }
      );
    }


    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' }, 
        { status: 401 }
      );
    }

   
    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });

  } catch (error) {

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка авторизации' }, 
      { status: 500 }
    );
  }
}