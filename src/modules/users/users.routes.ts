import { Router, Request, Response } from "express";
import { protect } from "../../middleware/auth.middleware";
import { prisma } from "../../lib/prisma";

const usersRouter = Router();

usersRouter.get("/me", protect, (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Protected route works",
    user: req.user,
  });
});

usersRouter.patch("/me", protect, async (req: Request, res: Response) => {
  try {
    const { universityId } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!universityId || typeof universityId !== "string") {
      return res.status(400).json({
        success: false,
        message: "University ID is required",
      });
    }

    const university = await prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        universityId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "University joined successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to join university",
    });
  }
});

export default usersRouter;