import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getAuthStatus } from '@/lib/auth-guard';

interface EventPayload {
    title?: string;
    description?: string | null;
    date?: string;
    photoUrl?: string | null;
    location?: string | null;
}

// Helper: Safely handle errors for logging
const getErrorMessage = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unknown error';
};

// Helper: Ensure the date string from the frontend is a valid JS Date
const normalizeDate = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const canViewAllEvents = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF';
const canMutateEvents = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF' || role === 'USER';
const publicEventThreshold = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

// --- GET ALL EVENTS ---
export async function GET(request: NextRequest) {
    try {
        const { role } = await getAuthStatus(request);
        const whereClause = canViewAllEvents(role)
            ? {}
            : { date: { gte: publicEventThreshold() } };

        const events = await prisma.event.findMany({
            where: whereClause,
            orderBy: { date: 'asc' },
        });

        return NextResponse.json(events);
    } catch (error: unknown) {
        console.error('GET Events Error:', getErrorMessage(error));
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// --- CREATE NEW EVENT ---
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthStatus(request);
        if (!auth.isAuth || !canMutateEvents(auth.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload: EventPayload = await request.json();
        const eventDate = normalizeDate(payload.date);

        // Validation: Title and Date are required for a valid event
        if (!payload.title || !eventDate) {
            return NextResponse.json(
                { error: 'Missing required fields: title and a valid date' },
                { status: 400 }
            );
        }

        const newEvent = await prisma.event.create({
            data: {
                title: payload.title,
                description: payload.description,
                date: eventDate,
                photoUrl: payload.photoUrl,
                location: payload.location,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error: unknown) {
        console.error('POST Event Error:', getErrorMessage(error));
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}