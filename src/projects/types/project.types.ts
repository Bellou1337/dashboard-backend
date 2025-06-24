import type { Project, User, ProjectMember, Role } from '@prisma/client';

export type ProjectCreator = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type ProjectMemberWithUser = {
  id: string;
  userId: string;
  projectId: string;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
};

export type ProjectWithDetails = {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  creator: ProjectCreator;
  members: ProjectMemberWithUser[];
};
