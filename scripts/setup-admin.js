const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔧 Admin 계정 설정을 시작합니다...');

    // 기존 admin 계정이 있는지 확인
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      console.log('⚠️  이미 admin 계정이 존재합니다.');
      console.log('기존 계정을 삭제하고 새로 생성하시겠습니까? (y/N)');

      // Node.js 환경에서 사용자 입력을 받기 위해 readline 사용
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('', resolve);
      });

      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Admin 계정 생성을 취소했습니다.');
        return;
      }

      // 기존 admin 계정 삭제
      await prisma.admin.deleteMany();
      console.log('🗑️  기존 admin 계정을 삭제했습니다.');
    }

    // 비밀번호 해시화
    const password = 'hanGUG3549!@';
    const hashedPassword = await bcrypt.hash(password, 12);

    // 새 admin 계정 생성
    const admin = await prisma.admin.create({
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ Admin 계정이 성공적으로 생성되었습니다!');
    console.log(`📋 Admin ID: ${admin.id}`);
    console.log(`🔑 비밀번호: ${password}`);
    console.log('📅 생성일시:', admin.createdAt);
    console.log('');
    console.log('🎉 이제 /admin 페이지에서 로그인할 수 있습니다.');
    console.log('💡 비밀키는 .env 파일의 ADMIN_SECRET_KEY 값을 사용하세요.');
  } catch (error) {
    console.error('❌ Admin 계정 생성 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
setupAdmin();
