import { prisma } from "../../lib/prisma";

type CreateUniversityInput = {
  universityName: string;
  universityAddress: string;
  contactNumber: string;
  logo?: string;
  bannerColor: string;
  bio: string;
};

export const getAllUniversities = async () => {
  return prisma.university.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createUniversity = async (
  data: CreateUniversityInput,
  userId: number
) => {
  const existingUniversity = await prisma.university.findUnique({
    where: {
      name: data.universityName,
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

  const [university, updatedUser] = await prisma.$transaction([
    prisma.university.create({
      data: {
        name: data.universityName,
        location: data.universityAddress,
        contact_info: data.contactNumber,
        logo: data.logo ?? null,
        banner_color: data.bannerColor,
        bio: data.bio,
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        universityId: undefined, 
      },
    }),
  ]);

  const finalUser = await prisma.user.update({
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
    updatedUser: finalUser,
  };
};