import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getAuthStatus } from '@/lib/auth-guard';

interface MenuPayload {
    name?: string;
    description?: string | null;
    price?: string | number;
    photoUrl?: string | null;
    popularity?: number | string;
    isAvailable?: boolean;
}

// Helper: Standard error logger
const getErrorMessage = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unknown error';
};

const canViewAllMenuItems = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF';
const canMutateMenu = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF' || role === 'USER';
const toDecimal = (value?: MenuPayload['price']) => {
    if (value === undefined || value === null) {
        return undefined;
    }

    const normalized = typeof value === 'string' ? value : value.toString();
    return new Prisma.Decimal(normalized);
};
const toNumber = (value?: number | string) => {
    if (value === undefined || value === null) {
        return undefined;
    }
    return typeof value === 'number' ? value : Number(value);
};

// --- GET ALL MENU ITEMS ---
export async function GET(request: NextRequest) {
    try {
        const { role } = await getAuthStatus(request);
        const whereClause = canViewAllMenuItems(role) ? {} : { isAvailable: true };

        const menuItems = await prisma.menuItem.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(menuItems);
    } catch (error: unknown) {
        console.error('GET Menu Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}

// --- CREATE MENU ITEM ---
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthStatus(request);
        if (!auth.isAuth || !canMutateMenu(auth.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload: MenuPayload = await request.json();

        // 1. Validation: Name and Price are strictly required
        if (!payload.name || payload.price === undefined || payload.price === null) {
            return NextResponse.json(
                { error: 'Name and price are required' },
                { status: 400 }
            );
        }

        // 2. Validation: Price cannot be negative
        const priceValue = typeof payload.price === 'string' ? parseFloat(payload.price) : payload.price;
        if (priceValue < 0) {
            return NextResponse.json(
                { error: 'Price cannot be negative' },
                { status: 400 }
            );
        }

        // 3. Create the item
        const newMenuItem = await prisma.menuItem.create({
            data: {
                name: payload.name,
                description: payload.description,
                price: toDecimal(payload.price)!,
                photoUrl: payload.photoUrl,
                popularity: toNumber(payload.popularity) ?? 0,
                isAvailable: payload.isAvailable ?? true,
            },
        });

        return NextResponse.json(newMenuItem, { status: 201 });

    } catch (error: unknown) {
        // 3. Specific check for Unique Name error (P2002)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'An item with this name already exists.' },
                { status: 400 }
            );
        }

        console.error('POST Menu Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }
}