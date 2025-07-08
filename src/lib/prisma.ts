// import { PrismaClient } from '../generated/prisma/client'
// const prisma = new PrismaClient()

// export default prisma;
// // use `prisma` in your application to read and write data in your DB

// import { PrismaClient } from "@/generated/prisma";
// const prisma = new PrismaClient();

// export default prisma;




// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma