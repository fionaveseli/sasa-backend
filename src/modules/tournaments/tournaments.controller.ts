import { Request, Response } from "express";
import {
  getAllTournaments,
  createTournament,
  registerTeamInTournament,
  updateTournamentStatus,
  getTournamentMatches,
} from "./tournaments.service";

export const getTournamentsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const tournaments = await getAllTournaments();

    return res.status(200).json({
      success: true,
      tournaments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tournaments",
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
      universityId,
      bracket_type,
      description,
      rules,
      time_zone,
    } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Tournament name is required",
      });
    }

    if (!type || typeof type !== "string") {
      return res.status(400).json({
        success: false,
        message: "Tournament type is required",
      });
    }

    if (!registration_deadline || typeof registration_deadline !== "string") {
      return res.status(400).json({
        success: false,
        message: "Registration deadline is required",
      });
    }

    if (!start_date || typeof start_date !== "string") {
      return res.status(400).json({
        success: false,
        message: "Start date is required",
      });
    }

    if (!end_date || typeof end_date !== "string") {
      return res.status(400).json({
        success: false,
        message: "End date is required",
      });
    }

    if (!universityId || typeof universityId !== "string") {
      return res.status(400).json({
        success: false,
        message: "University ID is required",
      });
    }

    if (!bracket_type || typeof bracket_type !== "string") {
      return res.status(400).json({
        success: false,
        message: "Bracket type is required",
      });
    }

    if (!description || typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    if (!rules || typeof rules !== "string") {
      return res.status(400).json({
        success: false,
        message: "Rules are required",
      });
    }

    if (!time_zone || typeof time_zone !== "string") {
      return res.status(400).json({
        success: false,
        message: "Time zone is required",
      });
    }

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const tournament = await createTournament({
      name,
      type,
      registration_deadline,
      start_date,
      end_date,
      universityId,
      bracket_type,
      description,
      rules,
      time_zone,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      tournament,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create tournament";

    return res.status(400).json({
      success: false,
      message,
    });
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
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    const result = await registerTeamInTournament(tournamentId, team_id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register team";

    return res.status(400).json({
      success: false,
      message,
    });
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
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const tournament = await updateTournamentStatus(tournamentId, status);

    return res.status(200).json({
      success: true,
      message: "Tournament status updated successfully",
      tournament,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update tournament status";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getTournamentMatchesController = async (
  req: Request,
  res: Response
) => {
  try {
    const tournamentId = Number(req.params.id);

    const matches = await getTournamentMatches(tournamentId);

    return res.status(200).json({
      success: true,
      matches,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};