import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const AdminOnly = () => Roles(Role.ADMIN);
export const ManagersOnly = () => Roles(Role.MANAGER, Role.TEAM_LEAD);
export const LeadersOnly = () => Roles(Role.TEAM_LEAD, Role.ADMIN);
export const AllRoles = () =>
  Roles(Role.DEVELOPER, Role.MANAGER, Role.TEAM_LEAD, Role.ADMIN);
