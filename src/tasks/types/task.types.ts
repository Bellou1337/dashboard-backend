import { TaskStatus, TaskPriority } from '@prisma/client';

interface UserBasic {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProjectBasic {
  id: string;
  name: string;
}

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
  assignee: UserBasic | null;
  creator: UserBasic;
  project: ProjectBasic;
}
