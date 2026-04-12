import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { RegisterInput } from "./auth.validation";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-me";

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "student",
      graduationYear: data.graduationYear,
      timeZone: data.timeZone,
      universityId: data.universityId,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      graduationYear: user.graduationYear,
      timeZone: user.timeZone,
      university_id: user.universityId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}