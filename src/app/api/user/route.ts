import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getAuthStatus } from '@/lib/auth-guard';

const SALT_ROUNDS = 10;

// --- GET ALL USERS ---
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthStatus(request);
    
    // Strict Admin-only check
    if (!auth.isAuth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// --- CREATE NEW USER ---
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthStatus(request);
    
    if (!auth.isAuth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, password, role, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'USER',
        name,
      },
      select: { id: true, email: true, role: true, name: true } // Don't return the password
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}