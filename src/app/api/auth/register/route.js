import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { login, password, name, email } = await req.json(); 
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.query(
      'INSERT INTO users (login, password_hash, name, email) VALUES (?, ?, ?, ?)',
      [login, hashedPassword, name, email]
    );
    
    return NextResponse.json({ message: 'User registered' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' }, 
      { status: 500 }
    );
  }
}