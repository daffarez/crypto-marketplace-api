import { prisma } from "../db/client.js";

export const registerUser = async (email: string) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("User exist!")
  }

  return prisma.user.create({
    data: { email },
  });
};
