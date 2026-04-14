import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  getUniversityTeamsController,
  createTeamController,
  joinTeamController,
  leaveTeamController,
  deleteTeamController,
} from "./teams.controller";

const teamsRouter = Router();

teamsRouter.get("/universities/:id/teams", protect, getUniversityTeamsController);
teamsRouter.post("/teams", protect, createTeamController);
teamsRouter.post("/teams/:id/join", protect, joinTeamController);
teamsRouter.post("/teams/:id/leave", protect, leaveTeamController);
teamsRouter.delete("/teams/:id", protect, deleteTeamController);

export default teamsRouter;