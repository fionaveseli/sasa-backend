import { prisma } from "../../lib/prisma";

export const getAllUniversities = async () => {
  const universities = await prisma.university.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return universities;
};

export const createUniversity = async (name: string, userId: number) => {
  const existingUniversity = await prisma.university.findUnique({
    where: {
      name,
    },
  });

  if (existingUniversity) {
    throw new Error("University already exists");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.universityId) {
    throw new Error("User already belongs to a university");
  }

  const university = await prisma.university.create({
    data: {
      name,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      universityId: university.id,
      role: "admin",
    },
  });

  return {
    university,
    updatedUser,
  };
};