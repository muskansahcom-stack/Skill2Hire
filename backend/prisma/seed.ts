import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Skill2Hire Database...');

  const passwordHash = await bcrypt.hash('demo123', 10);

  // 1. Student User & Profile (Alex Rivera)
  const studentUser = await prisma.user.upsert({
    where: { email: 'alex.rivera@student.skill2hire.com' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'alex.rivera@student.skill2hire.com',
      phone: '+919876543210',
      passwordHash,
      role: 'STUDENT',
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'ACTIVE',
      studentProfile: {
        create: {
          collegeName: 'Apex University of Engineering',
          degree: 'Bachelor of Science',
          branch: 'Computer Science',
          graduationYear: 2026,
          cgpa: 8.6,
          bio: 'Passionate full-stack & AI software engineer.'
        }
      }
    }
  });

  // 2. College User & Profile (Apex University)
  const collegeUser = await prisma.user.upsert({
    where: { email: 'admin@apexuniversity.edu' },
    update: {},
    create: {
      name: 'Apex University Placement Cell',
      email: 'admin@apexuniversity.edu',
      phone: '+919876543211',
      passwordHash,
      role: 'COLLEGE',
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'ACTIVE',
      collegeProfile: {
        create: {
          collegeName: 'Apex University of Engineering',
          description: 'Tier-1 Engineering Institution with industry-leading placement records.',
          website: 'https://apexuniversity.edu',
          location: 'Bangalore, India',
          verificationStatus: 'VERIFIED'
        }
      }
    }
  });

  // 3. Company User & Profile (TechNova)
  const companyUser = await prisma.user.upsert({
    where: { email: 'recruiter@technova.com' },
    update: {},
    create: {
      name: 'TechNova HR & Hiring Team',
      email: 'recruiter@technova.com',
      phone: '+919876543212',
      passwordHash,
      role: 'COMPANY',
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'ACTIVE',
      companyProfile: {
        create: {
          companyName: 'TechNova',
          description: 'Global cloud intelligence and software engineering enterprise.',
          website: 'https://technova.com',
          industry: 'Enterprise Software',
          location: 'Bangalore, India'
        }
      }
    }
  });

  // 4. Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@skill2hire.com' },
    update: {},
    create: {
      name: 'Platform SuperAdmin',
      email: 'admin@skill2hire.com',
      phone: '+919876543213',
      passwordHash,
      role: 'ADMIN',
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'ACTIVE'
    }
  });

  // 5. Skills
  const skills = [
    { name: 'Python', category: 'Programming' },
    { name: 'Data Structures & Algorithms', category: 'Core CS' },
    { name: 'SQL', category: 'Database' },
    { name: 'AWS Cloud', category: 'Infrastructure' },
    { name: 'React.js', category: 'Frontend' }
  ];

  for (const sk of skills) {
    await prisma.skill.upsert({
      where: { name: sk.name },
      update: {},
      create: sk
    });
  }

  console.log('✅ Seed completed successfully:');
  console.log('   - Student: alex.rivera@student.skill2hire.com / demo123');
  console.log('   - College: admin@apexuniversity.edu / demo123');
  console.log('   - Company: recruiter@technova.com / demo123');
  console.log('   - Admin: admin@skill2hire.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
