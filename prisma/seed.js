const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@veer.com'; // Using email format for username
  const password = 'password123';

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: {
      username: email
    }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.admin.create({
      data: {
        username: email,
        password: hashedPassword,
      },
    });
    console.log(`Admin user created: ${email} / ${password}`);
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
