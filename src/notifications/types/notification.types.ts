export enum NotificationType {
  TASK_STATUS_UPDATED = 'TASK_STATUS_UPDATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_CREATED = 'TASK_CREATED',
}

export interface TaskNotificationPayload {
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  previousStatus?: string;
  newStatus?: string;
  actorId: string;
  actorName: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  read: boolean;
  createdAt: Date;
  payload: TaskNotificationPayload;
}
