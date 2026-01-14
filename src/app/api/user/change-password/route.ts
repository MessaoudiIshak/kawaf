import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getAuthStatus, DecodedToken } from '@/lib/auth-guard';
import { Prisma } from '@prisma/client';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Basic Auth Check (Check if token is valid)
    const auth = await getAuthStatus(request);
    if (!auth.isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Extract Email manually from the token to avoid TS errors on auth.email
    const authHeader = request.headers.get('authorization');
    const token = authHeader!.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userEmail = decoded.email;

    const payload: ChangePasswordPayload = await request.json();

    if (!payload.currentPassword || !payload.newPassword) {
      return NextResponse.json(
        { error: 'Current and new passwords are required' },
        { status: 400 }
      );
    }

    // 3. Find User
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Verify Current Password
    const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // 5. Hash and Update
    const hashedNewPassword = await bcrypt.hash(payload.newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}