// prisma/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // Standard security level for bcrypt

async function main() {
  const adminEmail = 'admin@kawaf.fr'; // Unique Admin email
  const adminPassword = process.env.ADMIN_PASSWORD!; // password from env variable
  
    // Ensure the ADMIN_PASSWORD is provided
  if (!adminPassword) {
  throw new Error("Missing ADMIN_PASSWORD in .env!");
    }       


  console.log(`Starting to hash password for ${adminEmail}...`);
  // Hash the plaintext password
  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  // Use upsert to prevent duplicates if the script is run multiple times
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Update password if user already exists
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN, // Set role using the Enum
    },
  });

  console.log(`✅ Admin user seeded with ID: ${adminUser.id}`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   (Password: ${adminPassword})`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });