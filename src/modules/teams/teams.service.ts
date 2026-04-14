import { prisma } from "../../lib/prisma";

export const getUniversityTeams = async (universityId: string) => {
  const teams = await prisma.team.findMany({
    where: {
      universityId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    bio: team.bio,
    logo: team.logo,
    university_id: team.universityId,
    created_by: team.createdBy,
    players: team.members.map((member) => member.user),
  }));
};

export const createTeam = async (data: {
  name: string;
  bio?: string;
  logo?: string;
  universityId: string;
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

  const team = await prisma.team.create({
    data: {
      name: data.name,
      bio: data.bio,
      logo: data.logo,
      universityId: data.universityId,
      createdBy: data.userId,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: data.userId,
    },
  });

  return team;
};

export const joinTeam = async (teamId: number, userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (!user.universityId) {
    throw new Error("User is not associated with a university");
  }

  if (user.universityId !== team.universityId) {
    throw new Error("You can only join teams from your university");
  }

  const existingMembership = await prisma.teamMember.findFirst({
    where: {
      userId,
    },
  });

  if (existingMembership) {
    throw new Error("User is already in a team");
  }

  await prisma.teamMember.create({
    data: {
      teamId,
      userId,
    },
  });

  return team;
};

export const leaveTeam = async (teamId: number, userId: number) => {
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
    },
  });

  if (!membership) {
    throw new Error("User is not a member of this team");
  }

  await prisma.teamMember.delete({
    where: {
      id: membership.id,
    },
  });

  return {
    message: "Successfully left the team",
  };
};

export const deleteTeam = async (teamId: number, userId: number) => {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.createdBy !== userId) {
    throw new Error("Only the team creator can delete this team");
  }

  await prisma.teamMember.deleteMany({
    where: {
      teamId,
    },
  });

  await prisma.team.delete({
    where: {
      id: teamId,
    },
  });

  return {
    message: "Team deleted successfully",
  };
};