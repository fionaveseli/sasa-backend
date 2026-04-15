import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  getTournamentsController,
  createTournamentController,
  registerTeamInTournamentController,
  updateTournamentStatusController,
  getTournamentMatchesController,
  getUniversityTournamentsController,
} from "./tournaments.controller";

const tournamentsRouter = Router();

tournamentsRouter.get("/tournaments", protect, getTournamentsController);
tournamentsRouter.get(
  "/universities/:id/tournaments",
  protect,
  getUniversityTournamentsController
);
tournamentsRouter.post("/tournaments", protect, createTournamentController);
tournamentsRouter.post(
  "/tournaments/:id/register",
  protect,
  registerTeamInTournamentController
);
tournamentsRouter.patch(
  "/tournaments/:id/status",
  protect,
  updateTournamentStatusController
);
tournamentsRouter.get(
  "/tournaments/:id/matches",
  protect,
  getTournamentMatchesController
);

export default tournamentsRouter;