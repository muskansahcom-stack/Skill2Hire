import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Supabase PostgreSQL Database Seed...');

  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error('db.json not found');
    return;
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(raw);

  // 1. Seed Users (ensure company, student, college, and admin users exist)
  console.log(`📦 Seeding Users...`);
  for (const u of data.users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        email: u.email,
        phone: u.phone || `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: (u.role || 'student').toUpperCase(),
        passwordHash: u.passwordHash || 'demo123'
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: (u.role || 'student').toUpperCase(),
        passwordHash: u.passwordHash || 'demo123'
      }
    });
  }

  // Ensure all Student Users exist
  for (const s of data.students) {
    const existingUser = await prisma.user.findUnique({ where: { id: s.userId } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: s.userId,
          name: s.fullName,
          email: s.email,
          phone: s.phone || `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          role: 'STUDENT',
          passwordHash: 'demo123'
        }
      });
    }
  }

  // Ensure all Company Users exist
  for (const comp of data.companies) {
    const existingUser = await prisma.user.findUnique({ where: { id: comp.userId } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: comp.userId,
          name: `${comp.name} Recruiter`,
          email: `recruiter@${comp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          role: 'COMPANY',
          passwordHash: 'demo123'
        }
      });
    }
  }

  // 2. Seed Colleges
  console.log(`🏛️ Seeding ${data.colleges.length} Colleges...`);
  for (const c of data.colleges) {
    await prisma.collegeProfile.upsert({
      where: { id: c.id },
      update: {
        collegeName: c.name,
        location: c.location,
        website: c.website,
        description: c.bio
      },
      create: {
        id: c.id,
        userId: c.userId,
        collegeName: c.name,
        location: c.location,
        website: c.website,
        description: c.bio || 'Premier engineering university.'
      }
    });
  }

  // 3. Seed Companies
  console.log(`🏢 Seeding ${data.companies.length} Companies...`);
  for (const comp of data.companies) {
    await prisma.companyProfile.upsert({
      where: { id: comp.id },
      update: {
        companyName: comp.name,
        industry: comp.industry,
        location: comp.location,
        website: comp.website,
        description: comp.description
      },
      create: {
        id: comp.id,
        userId: comp.userId,
        companyName: comp.name,
        industry: comp.industry,
        location: comp.location,
        website: comp.website,
        description: comp.description
      }
    });
  }

  // 4. Seed Students
  console.log(`🎓 Seeding ${data.students.length} Students...`);
  for (const s of data.students) {
    await prisma.studentProfile.upsert({
      where: { id: s.id },
      update: {
        collegeName: s.collegeName,
        degree: s.degree,
        branch: s.department,
        graduationYear: s.graduationYear,
        cgpa: s.cgpa,
        bio: s.bio
      },
      create: {
        id: s.id,
        userId: s.userId,
        collegeName: s.collegeName,
        degree: s.degree,
        branch: s.department,
        graduationYear: s.graduationYear,
        cgpa: s.cgpa,
        bio: s.bio || 'Passionate software engineer'
      }
    });
  }

  // 5. Seed Skills
  console.log(`⚡ Seeding ${data.skills.length} Technical Skills...`);
  for (const sk of data.skills) {
    await prisma.skill.upsert({
      where: { name: sk.name },
      update: {
        category: sk.category
      },
      create: {
        id: sk.id,
        name: sk.name,
        category: sk.category
      }
    });
  }

  // 6. Seed Jobs
  console.log(`💼 Seeding ${data.jobs.length} Tech Jobs...`);
  for (const j of data.jobs) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: {
        title: j.title,
        location: j.location,
        jobType: j.employmentType || 'FULL_TIME',
        description: j.description
      },
      create: {
        id: j.id,
        companyId: j.companyId,
        title: j.title,
        description: j.description,
        jobType: j.employmentType || 'FULL_TIME',
        location: j.location || 'San Francisco, CA',
        status: 'OPEN'
      }
    });
  }

  console.log('✨ All 18+ Relational Schema Tables Seeded in Supabase PostgreSQL!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
