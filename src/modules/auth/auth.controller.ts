import { Request, Response } from "express";
import { ZodError } from "zod";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  try {
    const parsedData = registerSchema.parse(req.body);
    const result = await registerUser(parsedData);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.errors[0]?.message || "Validation error",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsedData = loginSchema.parse(req.body);
    const result = await loginUser(parsedData);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.errors[0]?.message || "Validation error",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}