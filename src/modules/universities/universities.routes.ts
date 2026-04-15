import { Router, Request, Response } from "express";
import { protect } from "../../middleware/auth.middleware";
import { prisma } from "../../lib/prisma";
import {
  getUniversitiesController,
  createUniversityController,
} from "./universities.controller";

const universitiesRouter = Router();

universitiesRouter.get("/", protect, getUniversitiesController);
universitiesRouter.post("/", protect, createUniversityController);

universitiesRouter.get(
  "/:universityId/users",
  protect,
  async (req: Request, res: Response) => {
    try {
const universityId = req.params.universityId as string;

      if (!universityId) {
        return res.status(400).json({
          success: false,
          message: "University ID is required",
        });
      }

      const users = await prisma.user.findMany({
        where: {
          universityId,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          graduationYear: true,
          timeZone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        users,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

export default universitiesRouter;