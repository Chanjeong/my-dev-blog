const { PrismaClient } = require('@prisma/client');

async function checkAdmins() {
  const prisma = new PrismaClient();

  try {
    const admins = await prisma.admin.findMany();
    console.log('현재 admins 테이블 데이터:');
    console.log(JSON.stringify(admins, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();

