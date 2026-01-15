import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const JWT_SECRET = process.env.JWT_SECRET_KEY || 'fallback_secret';

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Create the Token (Include Role and Name)
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role, 
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Send back the token and user info
    return NextResponse.json({
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}