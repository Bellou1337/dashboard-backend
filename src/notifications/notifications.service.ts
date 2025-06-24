import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  NotificationType,
  TaskNotificationPayload,
  Notification,
} from './types';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private notifications: Map<string, Notification[]> = new Map();
  private notificationsGateway: any;

  setGateway(gateway: any): void {
    this.notificationsGateway = gateway;
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notifications.get(userId) || [];
  }

  async createTaskStatusNotification(
    projectId: string,
    taskId: string,
    taskTitle: string,
    previousStatus: string,
    newStatus: string,
    actorId: string,
    actorName: string,
  ): Promise<string[]> {
    const projectManagers = await this.getProjectManagers(projectId);
    const payload: TaskNotificationPayload = {
      taskId,
      taskTitle,
      projectId,
      projectName: await this.getProjectName(projectId),
      previousStatus,
      newStatus,
      actorId,
      actorName,
    };

    const userIds = projectManagers
      .filter((manager) => manager.userId !== actorId)
      .map((manager) => manager.userId);

    await this.storeNotifications(
      userIds,
      NotificationType.TASK_STATUS_UPDATED,
      payload,
    );

    if (this.notificationsGateway) {
      this.notificationsGateway.notifyUsers(
        userIds,
        'taskStatusUpdated',
        payload,
      );
    }

    return userIds;
  }

  async createTaskAssignedNotification(
    projectId: string,
    taskId: string,
    taskTitle: string,
    assigneeId: string,
    actorId: string,
    actorName: string,
  ): Promise<string[]> {
    const payload: TaskNotificationPayload = {
      taskId,
      taskTitle,
      projectId,
      projectName: await this.getProjectName(projectId),
      actorId,
      actorName,
    };

    const userIds = [assigneeId].filter((id) => id !== actorId);

    await this.storeNotifications(
      userIds,
      NotificationType.TASK_ASSIGNED,
      payload,
    );

    if (this.notificationsGateway) {
      this.notificationsGateway.notifyUsers(userIds, 'taskAssigned', payload);
    }

    return userIds;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find((n) => n.id === notificationId);

    if (notification) {
      notification.read = true;
    }
  }

  private async getProjectManagers(
    projectId: string,
  ): Promise<{ userId: string }[]> {
    return this.prisma.projectMember.findMany({
      where: {
        projectId,
        user: {
          role: {
            in: ['MANAGER', 'TEAM_LEAD'],
          },
        },
      },
      select: {
        userId: true,
      },
    });
  }

  private async getProjectName(projectId: string): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true },
    });
    return project?.name || 'Unknown Project';
  }

  private async storeNotifications(
    userIds: string[],
    type: NotificationType,
    payload: TaskNotificationPayload,
  ): Promise<void> {
    for (const userId of userIds) {
      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type,
        userId,
        read: false,
        createdAt: new Date(),
        payload,
      };

      if (!this.notifications.has(userId)) {
        this.notifications.set(userId, []);
      }

      const userNotifications = this.notifications.get(userId)!;
      userNotifications.push(notification);

      if (userNotifications.length > 50) {
        userNotifications.shift();
      }
    }
  }
}
