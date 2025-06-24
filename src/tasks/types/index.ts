import { TaskStatus, TaskPriority, User, Project } from '@prisma/client';

export interface TaskWithDetails {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  assignedTo: string | null;
  createdBy: string;
  assignee: User | null;
  creator: User;
  project: Pick<Project, 'id' | 'name'>;
}

export * from './task.types';
