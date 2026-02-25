import { NextRequest, NextResponse } from 'next/server';
import { Prisma, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Context } from '@/types/types';
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

// Helper: Ensure the ID is a valid integer (rejects decimals)
const parseBlogPostId = (id: string) => {
	if (!/^-?\d+$/.test(id)) return null;
	const blogPostId = parseInt(id, 10);
	return Number.isNaN(blogPostId) ? null : blogPostId;
};

const canMutateBlogPosts = (role: Role | 'none') => role === 'ADMIN' || role === 'STAFF' || role === 'USER';

// --- GET ONE BLOG POST (PUBLIC ACCESS) ---
export async function GET(_request: NextRequest, { params }: Context) {
	try {
		await getAuthStatus(_request); // Ensures consistent auth handling
		const { id } = await params;
		const blogPostId = parseBlogPostId(id);

		if (blogPostId === null) {
			return NextResponse.json({ error: 'Invalid blog post id' }, { status: 400 });
		}

		const blogPost = await prisma.blogPost.findUnique({
			where: { id: blogPostId },
		});

		if (!blogPost) {
			return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
		}

		return NextResponse.json(blogPost);
	} catch (error: unknown) {
		console.error('GET Blog Post Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to fetch blog post' },
			{ status: 500 }
		);
	}
}

// --- UPDATE BLOG POST (PUT) ---
export async function PUT(request: NextRequest, { params }: Context) {
	try {
		const auth = await getAuthStatus(request);
		if (!auth.isAuth || !canMutateBlogPosts(auth.role)) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const blogPostId = parseBlogPostId(id);

		if (blogPostId === null) {
			return NextResponse.json({ error: 'Invalid blog post id' }, { status: 400 });
		}

		// 1. Check if it exists
		const existingBlogPost = await prisma.blogPost.findUnique({
			where: { id: blogPostId },
		});

		if (!existingBlogPost) {
			return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
		}

		const payload: BlogPostPayload = await request.json();

		// 2. Update with partial fields support
		const updatedBlogPost = await prisma.blogPost.update({
			where: { id: blogPostId },
			data: {
				...(payload.title !== undefined && { title: payload.title }),
				...(payload.content !== undefined && { content: payload.content }),
				photoUrl: payload.photoUrl,
				...(payload.author !== undefined && { author: payload.author }),
				...(payload.isPublished !== undefined && { isPublished: payload.isPublished }),
			},
		});

		return NextResponse.json(updatedBlogPost);
	} catch (error: unknown) {
		console.error('PUT Blog Post Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to update blog post' },
			{ status: 500 }
		);
	}
}

// --- DELETE BLOG POST ---
export async function DELETE(_request: NextRequest, { params }: Context) {
	try {
		const auth = await getAuthStatus(_request);
		if (!auth.isAuth || !canMutateBlogPosts(auth.role)) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const blogPostId = parseBlogPostId(id);

		if (blogPostId === null) {
			return NextResponse.json({ error: 'Invalid blog post id' }, { status: 400 });
		}

		// 1. Check if it exists
		const existingBlogPost = await prisma.blogPost.findUnique({
			where: { id: blogPostId },
		});

		if (!existingBlogPost) {
			return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
		}

		// 2. Delete
		await prisma.blogPost.delete({ where: { id: blogPostId } });

		return NextResponse.json({ message: 'Blog post deleted successfully' });
	} catch (error: unknown) {
		console.error('DELETE Blog Post Error:', getErrorMessage(error));
		return NextResponse.json(
			{ error: 'Failed to delete blog post' },
			{ status: 500 }
		);
	}
}
