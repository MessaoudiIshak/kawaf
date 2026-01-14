import { PrismaClient, Role, Sex } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Starting full database seeding...');

  // --- 1. USERS (Roles Testing) ---
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('❌ Error: ADMIN_PASSWORD not found in .env');
    process.exit(1);
  }

  const hashedAdminPw = await bcrypt.hash(adminPassword, SALT_ROUNDS);
  const hashedStaffPw = await bcrypt.hash('staff123', SALT_ROUNDS);
  const hashedUserPw = await bcrypt.hash('user123', SALT_ROUNDS);

  const users = [
    { email: 'admin@kawaf.fr', password: hashedAdminPw, role: Role.ADMIN, name: 'Main Boss' },
    { email: 'staff@kawaf.fr', password: hashedStaffPw, role: Role.STAFF, name: 'Barista Sam' },
    { email: 'customer@gmail.com', password: hashedUserPw, role: Role.USER, name: 'Regular Joe' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: u.password, role: u.role, name: u.name },
      create: u,
    });
  }
  console.log('✅ Users seeded (Admin, Staff, User)');

  // --- 2. MENU ITEMS (Decimal & Availability Testing) ---
  const menuItems = [
    { name: 'Espresso', price: 2.50, description: 'Bold and dark', isAvailable: true },
    { name: 'Caramel Macchiato', price: 4.80, description: 'Sweet and layered', isAvailable: true },
    { name: 'Seasonal Pumpkin Latte', price: 5.50, description: 'Autumn special', isAvailable: false },
    { name: 'Vegan Brownie', price: 3.90, description: 'Gluten free and delicious', isAvailable: true },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }
  console.log('☕ Menu seeded');

  // --- 3. ANIMALS (Sex & Adoption Testing) ---
  const cats = [
    { name: 'Luna', age: 2, weight: 4.5, sex: Sex.FEMALE, temperament: 'Calm', isAdopted: false, story: 'Loves laps.' },
    { name: 'Mochi', age: 1, weight: 3.8, sex: Sex.MALE, temperament: 'Wild', isAdopted: false, story: 'Chases shadows.' },
    { name: 'Croissant', age: 5, weight: 6.2, sex: Sex.MALE, temperament: 'Lazy', isAdopted: true, story: 'Already found a home!' },
  ];

  for (const cat of cats) {
    await prisma.animal.upsert({
      where: { id: cats.indexOf(cat) + 1 },
      update: {},
      create: cat,
    });
  }
  console.log('🐱 Cats seeded');

  // --- 4. EVENTS (Date Filtering Testing) ---
  const events = [
    { title: 'Past Workshop', date: new Date('2024-01-01T10:00:00Z'), description: 'Old event' },
    { title: 'Cat Yoga', date: new Date('2026-05-20T14:00:00Z'), description: 'Yoga with kittens' },
    { title: 'Coffee Tasting', date: new Date('2026-12-25T09:00:00Z'), description: 'Christmas morning beans' },
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { id: events.indexOf(ev) + 1 },
      update: {},
      create: ev,
    });
  }
  console.log('📅 Events seeded');

  console.log('✨ Full seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });