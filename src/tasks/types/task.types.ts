import { TaskStatus, TaskPriority } from '@prisma/client';

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
  assignee: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  creator: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  project: {
    id: string;
    name: string;
  };
}
