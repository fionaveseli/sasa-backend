import { Request, Response } from "express";
import {
  getAllTournaments,
  createTournament,
  registerTeamInTournament,
  updateTournamentStatus,
  getTournamentMatches,
  getUniversityTournaments,
} from "./tournaments.service";

export const getTournamentsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const tournaments = await getAllTournaments();

    return res.status(200).json({
      tournaments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch tournaments",
    });
  }
};

export const getUniversityTournamentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const universityId = req.params.id as string;
    const tournaments = await getUniversityTournaments(universityId);

    return res.status(200).json({
      tournaments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch university tournaments",
    });
  }
};

export const createTournamentController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      type,
      registration_deadline,
      start_date,
      end_date,
      bracket_type,
      description,
      rules,
      time_zone,
    } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Tournament name is required" });
    }

    if (!type || typeof type !== "string") {
      return res.status(400).json({ message: "Tournament type is required" });
    }

    if (!registration_deadline || typeof registration_deadline !== "string") {
      return res.status(400).json({ message: "Registration deadline is required" });
    }

    if (!start_date || typeof start_date !== "string") {
      return res.status(400).json({ message: "Start date is required" });
    }

    if (!end_date || typeof end_date !== "string") {
      return res.status(400).json({ message: "End date is required" });
    }

    if (!bracket_type || typeof bracket_type !== "string") {
      return res.status(400).json({ message: "Bracket type is required" });
    }

    if (!description || typeof description !== "string") {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!rules || typeof rules !== "string") {
      return res.status(400).json({ message: "Rules are required" });
    }

    if (!time_zone || typeof time_zone !== "string") {
      return res.status(400).json({ message: "Time zone is required" });
    }

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tournament = await createTournament({
      name,
      type,
      registration_deadline,
      start_date,
      end_date,
      bracket_type,
      description,
      rules,
      time_zone,
      userId: req.user.userId,
    });

    return res.status(201).json({
      tournament,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to create tournament";

    return res.status(400).json({ message });
  }
};

export const registerTeamInTournamentController = async (
  req: Request,
  res: Response
) => {
  try {
    const tournamentId = Number(req.params.id);
    const { team_id } = req.body;

    if (!team_id || typeof team_id !== "number") {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const result = await registerTeamInTournament(tournamentId, team_id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to register team";

    return res.status(400).json({ message });
  }
};

export const updateTournamentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const tournamentId = Number(req.params.id);
    const { status } = req.body;

    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Status is required" });
    }

    const tournament = await updateTournamentStatus(tournamentId, status);

    return res.status(200).json({
      tournament,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update tournament status";

    return res.status(400).json({ message });
  }
};

export const getTournamentMatchesController = async (
  req: Request,
  res: Response
) => {
  try {
    const tournamentId = Number(req.params.id);
    const matches = await getTournamentMatches(tournamentId);

    return res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";

    return res.status(400).json({ message });
  }
};