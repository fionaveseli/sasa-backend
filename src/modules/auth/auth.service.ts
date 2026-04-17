import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { LoginInput, RegisterInput } from "./auth.validation";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

function buildAuthResponse(user: {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "university_manager" | "student";
  graduationYear: number;
  timeZone: string;
  universityId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    user,
    token,
  };
}

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
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
      role: "student", // 🔥 force role
      graduationYear: data.graduationYear,
      timeZone: data.timeZone,
      universityId: data.universityId,
    },
  });

  const { password, ...safeUser } = user;

  return buildAuthResponse(safeUser);
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const { password, ...safeUser } = user;

  return buildAuthResponse(safeUser);
}