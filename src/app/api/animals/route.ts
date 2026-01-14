import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
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

const canViewAllAnimals = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF';

// --- GET ALL ANIMALS ---
export async function GET(request: NextRequest) {
    try {
        const { role } = await getAuthStatus(request);
        const whereClause = canViewAllAnimals(role) ? {} : { isAdopted: false };

        const animals = await prisma.animal.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(animals);
    } catch (error: unknown) {
        console.error('GET Animals Error:', getErrorMessage(error));
        return NextResponse.json(
            { error: 'Failed to fetch animals' },
            { status: 500 }
        );
    }
}

// --- CREATE NEW ANIMAL ---
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthStatus(request);
        if (!auth.isAuth || auth.role === 'none') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload: AnimalPayload = await request.json();

        // Validation: A name is the bare minimum required for a record
        if (!payload.name) {
            return NextResponse.json(
                { error: 'Missing required field: name' },
                { status: 400 }
            );
        }

        const newAnimal = await prisma.animal.create({
            data: {
                name: payload.name,
                photoUrl: payload.photoUrl,
                age: payload.age !== undefined && payload.age !== null ? parseInt(String(payload.age), 10) : null,
                weight: payload.weight !== undefined && payload.weight !== null ? parseFloat(String(payload.weight)) : null,
                sex: payload.sex, // Frontend must send "MALE" or "FEMALE"
                temperament: payload.temperament,
                story: payload.story,
                isAdopted: payload.isAdopted ?? false,
            },
        });

        return NextResponse.json(newAnimal, { status: 201 });
    } catch (error: unknown) {
        console.error('POST Animal Error:', getErrorMessage(error));
        return NextResponse.json(
            { error: 'Failed to add animal to the database' },
            { status: 500 }
        );
    }
}