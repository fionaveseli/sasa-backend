import { prisma } from "../../lib/prisma";

export const getAllTournaments = async () => {
  return prisma.tournament.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      registrationDeadline: true,
      startDate: true,
      endDate: true,
      universityId: true,
      bracketType: true,
      description: true,
      rules: true,
      timeZone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getUniversityTournaments = async (universityId: string) => {
  return prisma.tournament.findMany({
    where: {
      universityId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      registrationDeadline: true,
      startDate: true,
      endDate: true,
      universityId: true,
      bracketType: true,
      description: true,
      rules: true,
      timeZone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createTournament = async (data: {
  name: string;
  type: string;
  registration_deadline: string;
  start_date: string;
  end_date: string;
  universityId: string;
  bracket_type: string;
  description: string;
  rules: string;
  time_zone: string;
  userId: number;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.universityId) {
    throw new Error("User is not associated with a university");
  }

  if (user.universityId !== data.universityId) {
    throw new Error("User does not belong to this university");
  }

  const tournament = await prisma.tournament.create({
    data: {
      name: data.name,
      type: data.type,
      registrationDeadline: new Date(data.registration_deadline),
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      universityId: data.universityId,
      bracketType: data.bracket_type,
      description: data.description,
      rules: data.rules,
      timeZone: data.time_zone,
      status: "draft",
    },
  });

  return tournament;
};

export const registerTeamInTournament = async (
  tournamentId: number,
  teamId: number
) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.universityId !== tournament.universityId) {
    throw new Error("Team does not belong to this university");
  }

  const existingRegistration = await prisma.tournamentTeam.findUnique({
    where: {
      tournamentId_teamId: {
        tournamentId,
        teamId,
      },
    },
  });

  if (existingRegistration) {
    throw new Error("Team is already registered in this tournament");
  }

  await prisma.tournamentTeam.create({
    data: {
      tournamentId,
      teamId,
    },
  });

  return {
    message: "Team registered successfully",
  };
};

export const updateTournamentStatus = async (
  tournamentId: number,
  status: string
) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  const updatedTournament = await prisma.tournament.update({
    where: {
      id: tournamentId,
    },
    data: {
      status,
    },
  });

  return updatedTournament;
};

export const getTournamentMatches = async (tournamentId: number) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  const matches = await prisma.match.findMany({
    where: {
      tournamentId,
    },
    orderBy: [
      {
        roundNumber: "asc",
      },
      {
        matchNumber: "asc",
      },
    ],
  });

  return matches;
};