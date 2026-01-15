import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Context } from '@/types/types';
import { getAuthStatus } from '@/lib/auth-guard';

type EventPayload = {
	title?: string;
	description?: string | null;
	date?: string;
	photoUrl?: string | null;
	location?: string | null;
};

const getErrorMessage = (error: unknown) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return error.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return 'Unknown error';
};

const normalizeDate = (value?: string) => {
	if (!value) {
		return undefined;
	}
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

// Helper: Ensure the ID is a valid integer (rejects decimals)
const parseEventId = (id: string) => {
	if (!/^-?\d+$/.test(id)) return null;
	const eventId = parseInt(id, 10);
	return Number.isNaN(eventId) ? null : eventId;
};

const canMutateEvents = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF' || role === 'USER';

export async function GET(_request: NextRequest, { params }: Context) {
	try {
		await getAuthStatus(_request);
		const { id } = await params;
		const eventId = parseEventId(id);

		if (eventId === null) {
			return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
		});

		if (!event) {
			return NextResponse.json({ error: 'Event not found' }, { status: 404 });
		}

		return NextResponse.json(event);
	} catch (error: unknown) {
		console.error('GET Event Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to fetch event from database' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, { params }: Context) {
	try {
		const auth = await getAuthStatus(request);
		if (!auth.isAuth || !canMutateEvents(auth.role)) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const eventId = parseEventId(id);

		if (eventId === null) {
			return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
		}

		const existingEvent = await prisma.event.findUnique({
			where: { id: eventId },
		});

		if (!existingEvent) {
			return NextResponse.json({ error: 'Event not found' }, { status: 404 });
		}

		const payload: EventPayload = await request.json();

		// Validate date if provided
		if (payload.date !== undefined) {
			const parsedDate = new Date(payload.date);
			if (Number.isNaN(parsedDate.getTime())) {
				return NextResponse.json(
					{ error: 'Invalid date format' },
					{ status: 400 }
				);
			}
		}

		const updatedEvent = await prisma.event.update({
			where: { id: eventId },
			data: {
				title: payload.title,
				description: payload.description,
				date: normalizeDate(payload.date),
				photoUrl: payload.photoUrl,
				location: payload.location,
			},
		});

		return NextResponse.json(updatedEvent);
	} catch (error: unknown) {
		console.error('PUT Event Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to update event' },
			{ status: 500 }
		);
	}
}

export async function DELETE(_request: NextRequest, { params }: Context) {
	try {
		const auth = await getAuthStatus(_request);
		if (!auth.isAuth || !canMutateEvents(auth.role)) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const eventId = parseEventId(id);

		if (eventId === null) {
			return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
		}

		const existingEvent = await prisma.event.findUnique({
			where: { id: eventId },
		});

		if (!existingEvent) {
			return NextResponse.json({ error: 'Event not found' }, { status: 404 });
		}

		await prisma.event.delete({ where: { id: eventId } });

		return NextResponse.json({ message: 'Event deleted successfully' });
	} catch (error: unknown) {
		console.error('DELETE Event Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to delete event' },
			{ status: 500 }
		);
	}
}
