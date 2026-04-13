import { Request, Response } from "express";
import { getAllUniversities, createUniversity } from "./universities.service";

export const getUniversitiesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const universities = await getAllUniversities();

    return res.status(200).json({
      success: true,
      universities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
    });
  }
};

export const createUniversityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { universityName } = req.body;

    if (!universityName || typeof universityName !== "string") {
      return res.status(400).json({
        success: false,
        message: "University name is required",
      });
    }

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await createUniversity(universityName, req.user.userId);
    const { password, ...safeUser } = result.updatedUser;

    return res.status(201).json({
      success: true,
      message: "University created successfully",
      university: result.university,
      user: safeUser,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create university";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
