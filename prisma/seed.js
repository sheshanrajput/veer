const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const plainPassword = 'Admin@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Upsert the admin user
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Updating password...');
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { password: hashedPassword },
    });
  } else {
    console.log('Creating admin user...');
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
