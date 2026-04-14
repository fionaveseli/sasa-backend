import { Request, Response } from "express";
import {
  getUniversityTeams,
  createTeam,
  joinTeam,
  leaveTeam,
  deleteTeam,
} from "./teams.service";

export const getUniversityTeamsController = async (
  req: Request,
  res: Response
) => {
  try {
const universityId = req.params.id as string;

const teams = await getUniversityTeams(universityId);

    return res.status(200).json({
      success: true,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};

export const createTeamController = async (req: Request, res: Response) => {
  try {
   const { name, bio, logo, universityId } = req.body;

if (!universityId || typeof universityId !== "string") {
  return res.status(400).json({
    success: false,
    message: "University ID is required",
  });
}

    if (!universityId || typeof universityId !== "string") {
      return res.status(400).json({
        success: false,
        message: "University ID is required",
      });
    }

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await createTeam({
      name,
      bio,
      logo,
      universityId,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create team";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const joinTeamController = async (req: Request, res: Response) => {
  try {
    const teamId = Number(req.params.id);

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await joinTeam(teamId, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Successfully joined the team",
      team,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to join team";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const leaveTeamController = async (req: Request, res: Response) => {
  try {
    const teamId = Number(req.params.id);

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await leaveTeam(teamId, req.user.userId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to leave team";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const deleteTeamController = async (req: Request, res: Response) => {
  try {
    const teamId = Number(req.params.id);

    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await deleteTeam(teamId, req.user.userId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete team";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};