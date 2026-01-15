import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Context } from '@/types/types';
import { getAuthStatus } from '@/lib/auth-guard';

interface MenuPayload {
    name?: string;
    description?: string | null;
    price?: string | number;
    photoUrl?: string | null;
    popularity?: number | string;
    isAvailable?: boolean;
}

// Helper: Safely handle errors for logging
const getErrorMessage = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unknown error';
};

// Helper: Ensure the ID is a valid integer (rejects decimals)
const parseMenuId = (id: string) => {
    if (!/^-?\d+$/.test(id)) return null;
    const menuId = parseInt(id, 10);
    return Number.isNaN(menuId) ? null : menuId;
};

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

// --- GET ONE ITEM ---
export async function GET(_request: NextRequest, { params }: Context) {
    try {
        await getAuthStatus(_request);
        const { id } = await params;
        const menuId = parseMenuId(id);

        if (menuId === null) {
            return NextResponse.json({ error: 'Invalid menu item id' }, { status: 400 });
        }

        const item = await prisma.menuItem.findUnique({
            where: { id: menuId },
        });

        if (!item) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error: unknown) {
        console.error('GET Menu Item Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
    }
}

// --- UPDATE ITEM (PUT) ---
export async function PUT(request: NextRequest, { params }: Context) {
    try {
        const auth = await getAuthStatus(request);
        if (!auth.isAuth || !canMutateMenu(auth.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const menuId = parseMenuId(id);

        if (menuId === null) {
            return NextResponse.json({ error: 'Invalid menu item id' }, { status: 400 });
        }

        // 1. Check existence
        const existingItem = await prisma.menuItem.findUnique({ where: { id: menuId } });
        if (!existingItem) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }

        const payload: MenuPayload = await request.json();

        // 2. Update
        const updatedItem = await prisma.menuItem.update({
            where: { id: menuId },
            data: {
                name: payload.name,
                description: payload.description,
                price: toDecimal(payload.price),
                photoUrl: payload.photoUrl,
                popularity: toNumber(payload.popularity),
                isAvailable: payload.isAvailable,
            },
        });

        return NextResponse.json(updatedItem);
    } catch (error: unknown) {
        // Handle Unique Constraint (e.g., trying to rename an item to an existing name)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: 'An item with this name already exists' }, { status: 400 });
        }

        console.error('PUT Menu Item Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }
}

// --- DELETE ITEM ---
export async function DELETE(_request: NextRequest, { params }: Context) {
    try {
        const auth = await getAuthStatus(_request);
        if (!auth.isAuth || !canMutateMenu(auth.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const menuId = parseMenuId(id);

        if (menuId === null) {
            return NextResponse.json({ error: 'Invalid menu item id' }, { status: 400 });
        }

        const existingItem = await prisma.menuItem.findUnique({ where: { id: menuId } });
        if (!existingItem) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }

        await prisma.menuItem.delete({ where: { id: menuId } });

        return NextResponse.json({ message: 'Menu item deleted successfully' });
    } catch (error: unknown) {
        console.error('DELETE Menu Item Error:', getErrorMessage(error));
        return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }
}