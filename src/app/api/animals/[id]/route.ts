import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Context } from '@/types/types';
import { getAuthStatus } from '@/lib/auth-guard';

interface AnimalPayload {
    name?: string;
    photoUrl?: string | null;
    age?: string | number | null;
    weight?: string | number | null;
    sex?: 'MALE' | 'FEMALE';
    temperament?: string | null;
    story?: string | null;
    isAdopted?: boolean;
}

// Helper: Safely handle errors for logging
const getErrorMessage = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unknown error';
};

// Helper: Ensure the ID is a valid number to prevent database crashes
const parseId = (id: string) => {
    const parsedId = parseInt(id, 10);
    return Number.isNaN(parsedId) ? null : parsedId;
};

const canMutateAnimal = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF' || role === 'USER';

// --- GET ONE ANIMAL ---
export async function GET(_request: NextRequest, { params }: Context) {
    try {
        await getAuthStatus(_request); // Ensures consistent auth handling even though everyone can access
        const { id } = await params;
        const animalId = parseId(id);

        if (animalId === null) {
            return NextResponse.json({ error: 'Invalid animal ID' }, { status: 400 });
        }

        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
        }

        return NextResponse.json(animal);
    } catch (error: unknown) {
        console.error('GET Animal Error:', getErrorMessage(error));
        return NextResponse.json(
            { error: 'Failed to fetch animal' },
            { status: 500 }
        );
    }
}

// --- UPDATE ANIMAL (PUT) ---
export async function PUT(request: NextRequest, { params }: Context) {
    try {
        const auth = await getAuthStatus(request);
        if (!auth.isAuth || !canMutateAnimal(auth.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const animalId = parseId(id);

        if (animalId === null) {
            return NextResponse.json({ error: 'Invalid animal ID' }, { status: 400 });
        }

        // 1. Check if it exists
        const existing = await prisma.animal.findUnique({ where: { id: animalId } });
        if (!existing) {
            return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
        }

        const data: AnimalPayload = await request.json();

        // 2. Update with type safety
        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                ...data,
                age: data.age !== undefined && data.age !== null ? parseInt(String(data.age), 10) : undefined,
                weight: data.weight !== undefined && data.weight !== null ? parseFloat(String(data.weight)) : undefined,
            },
        });

        return NextResponse.json(updatedAnimal);
    } catch (error: unknown) {
        console.error('PUT Animal Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

// --- DELETE ANIMAL ---
export async function DELETE(_request: NextRequest, { params }: Context) {
    try {
        const auth = await getAuthStatus(_request);
        if (!auth.isAuth || !canMutateAnimal(auth.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const animalId = parseId(id);

        if (animalId === null) {
            return NextResponse.json({ error: 'Invalid animal ID' }, { status: 400 });
        }

        // 1. Check if it exists
        const existing = await prisma.animal.findUnique({ where: { id: animalId } });
        if (!existing) {
            return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
        }

        // 2. Delete
        await prisma.animal.delete({ where: { id: animalId } });

        return NextResponse.json({ message: 'Animal deleted successfully' });
    } catch (error: unknown) {
        console.error('DELETE Animal Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}