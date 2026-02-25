import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getAuthStatus } from '@/lib/auth-guard';

interface BlogPostPayload {
	title?: string;
	content?: string;
	photoUrl?: string | null;
	author?: string;
	isPublished?: boolean;
}

// Helper: Safely handle errors for logging
const getErrorMessage = (error: unknown) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) return error.message;
	if (error instanceof Error) return error.message;
	return 'Unknown error';
};

const canViewAllBlogPosts = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF';
const canMutateBlogPosts = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF' || role === 'USER';

// --- GET ALL BLOG POSTS ---
export async function GET(request: NextRequest) {
	try {
		const { role } = await getAuthStatus(request);
		const whereClause = canViewAllBlogPosts(role)
			? {}
			: { isPublished: true };

		const blogPosts = await prisma.blogPost.findMany({
			where: whereClause,
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(blogPosts);
	} catch (error: unknown) {
		console.error('GET Blog Posts Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to fetch blog posts' },
			{ status: 500 }
		);
	}
}

// --- CREATE NEW BLOG POST ---
export async function POST(request: NextRequest) {
	try {
		const auth = await getAuthStatus(request);
		if (!auth.isAuth || !canMutateBlogPosts(auth.role)) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const payload: BlogPostPayload = await request.json();

		// Validation: Title, content, and author are required
		if (!payload.title || !payload.content || !payload.author) {
			return NextResponse.json(
				{ error: 'Missing required fields: title, content, and author' },
				{ status: 400 }
			);
		}

		const newBlogPost = await prisma.blogPost.create({
			data: {
				title: payload.title,
				content: payload.content,
				photoUrl: payload.photoUrl,
				author: payload.author,
				isPublished: payload.isPublished ?? false,
			},
		});

		return NextResponse.json(newBlogPost, { status: 201 });
	} catch (error: unknown) {
		console.error('POST Blog Post Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to create blog post' },
			{ status: 500 }
		);
	}
}
