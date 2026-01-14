import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthStatus } from '@/lib/auth-guard';
import { Context } from '@/types/types';
import { Prisma, Role } from '@prisma/client';

// Helper for Prisma Errors (The "cleaner" way we discussed)
const handlePrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return 'Email already in use';
    if (error.code === 'P2025') return 'User not found';
  }
  return 'Database operation failed';
};

// --- UPDATE USER (PUT) ---
export async function PUT(request: NextRequest, context: Context) {
  try {
    const auth = await getAuthStatus(request);
    if (!auth.isAuth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;
    const { email, name, role } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: {
        email,
        name,
        role: role as Role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    const message = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// --- DELETE USER (DELETE) ---
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const auth = await getAuthStatus(request);
    if (!auth.isAuth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;
    const userId = parseInt(id, 10);

    // Prevent an admin from deleting themselves (safety check)
    // Note: You'd need to pass the current user's ID in the JWT to do this perfectly
    
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    const message = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status: 404 });
  }
}