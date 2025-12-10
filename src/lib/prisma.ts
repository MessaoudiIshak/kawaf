// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// 1. Declare a global variable to store the PrismaClient instance
// This prevents multiple instances when Next.js performs hot-reloading in development.

declare global {
  
  var prisma: PrismaClient | undefined; // eslint-disable-next-line no-var
}

// 2. Initialize the client:
// Use the global instance if it exists, otherwise create a new one.
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : [],
});

// 3. In production, we don't assign to global (security/standard practice).
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// 4. Export the client for use in your API handlers
export default prisma;