import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedUser } from './types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedClients: Map<string, ConnectedUser> = new Map();

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {
    this.notificationsService.setGateway(this);
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.disconnect(client);
        return;
      }

      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      if (!userId) {
        this.disconnect(client);
        return;
      }

      this.connectedClients.set(client.id, {
        userId,
        socketId: client.id,
        projectIds: [],
      });

      this.logger.log(`Client connected: ${client.id}, userId: ${userId}`);

      const notifications =
        await this.notificationsService.getNotificationsForUser(userId);
      client.emit('notifications', notifications);
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ): void {
    const user = this.connectedClients.get(client.id);
    if (user && data.projectId) {
      if (!user.projectIds.includes(data.projectId)) {
        user.projectIds.push(data.projectId);
      }
      client.join(`project_${data.projectId}`);
      this.logger.log(`User ${user.userId} joined project ${data.projectId}`);
    }
  }

  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ): void {
    const user = this.connectedClients.get(client.id);
    if (user && data.projectId) {
      user.projectIds = user.projectIds.filter((id) => id !== data.projectId);
      client.leave(`project_${data.projectId}`);
      this.logger.log(`User ${user.userId} left project ${data.projectId}`);
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ): Promise<void> {
    const user = this.connectedClients.get(client.id);
    if (user && data.notificationId) {
      await this.notificationsService.markAsRead(
        data.notificationId,
        user.userId,
      );
    }
  }

  notifyUsers(userIds: string[], eventName: string, data: any): void {
    for (const [clientId, user] of this.connectedClients.entries()) {
      if (userIds.includes(user.userId)) {
        this.server.to(clientId).emit(eventName, data);
        this.logger.log(`Sent ${eventName} to user ${user.userId}`);
      }
    }
  }

  notifyProjectManagers(projectId: string, eventName: string, data: any): void {
    this.server.to(`project_${projectId}`).emit(eventName, data);
    this.logger.log(`Sent ${eventName} to project ${projectId} managers`);
  }

  private disconnect(client: Socket): void {
    client.emit('error', new UnauthorizedException('Authentication failed'));
    client.disconnect();
  }
}
