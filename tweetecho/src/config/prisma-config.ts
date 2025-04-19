import { PrismaClient } from "@prisma/client";

const getPrisma = () => {
  const prisma = new PrismaClient();
  prisma.$connect();
  return prisma;
};

export default getPrisma;
