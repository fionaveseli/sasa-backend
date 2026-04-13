import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  getUniversitiesController,
  createUniversityController,
} from "./universities.controller";

const universitiesRouter = Router();

universitiesRouter.get("/", protect, getUniversitiesController);
universitiesRouter.post("/", protect, createUniversityController);

export default universitiesRouter;