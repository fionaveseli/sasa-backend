import { Router, Request, Response } from "express";
import { protect } from "../../middleware/auth.middleware";

const usersRouter = Router();

usersRouter.get("/me", protect, (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Protected route works",
    user: req.user,
  });
});

export default usersRouter;