import { Request, Response } from "express";
import { getAllUniversities, createUniversity } from "./universities.service";

export const getUniversitiesController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const universities = await getAllUniversities();

    res.status(200).json({
      universities,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch universities",
    });
  }
};

export const createUniversityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      universityName,
      universityAddress,
      contactNumber,
      logo,
      bannerColor,
      bio,
    } = req.body;

    if (!universityName) {
      res.status(400).json({
        message: "University name is required",
      });
      return;
    }

    if (!req.user?.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const result = await createUniversity(
      {
        universityName,
        universityAddress,
        contactNumber,
        logo,
        bannerColor,
        bio,
      },
      req.user.userId
    );

    const { password, ...safeUser } = result.updatedUser;

    res.status(201).json({
      university: result.university,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Failed to create university";

    res.status(400).json({
      message,
    });
  }
};