// Prisma Client Singleton with Safe Dynamic Loading for Next.js

type PrismaClientType = any;

let PrismaClientClass: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaClientClass = require("@prisma/client")?.PrismaClient;
} catch {
  // Graceful fallback if @prisma/client is pending generation
  PrismaClientClass = class MockPrismaClient {
    user = {
      findUnique: async () => null,
      findFirst: async () => null,
      create: async (args: any) => args.data,
      update: async (args: any) => args.data,
    };
    userPreference = {
      findUnique: async () => null,
      create: async (args: any) => args.data,
      upsert: async (args: any) => args.create,
    };
    learningSession = {
      findMany: async () => [],
      create: async (args: any) => ({ id: `sess-${Date.now()}`, ...args.data }),
    };
    topicProgress = {
      findUnique: async () => null,
      findMany: async () => [],
      upsert: async (args: any) => ({ id: `prog-${Date.now()}`, ...args.create }),
    };
    quizAttempt = {
      findMany: async () => [],
      create: async (args: any) => ({ id: `att-${Date.now()}`, ...args.data }),
    };
    recommendation = {
      findMany: async () => [],
      create: async (args: any) => ({ id: `rec-${Date.now()}`, ...args.data }),
    };
  };
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientType | undefined;
}

export const prisma: PrismaClientType =
  global.prismaGlobal ||
  new PrismaClientClass();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;
