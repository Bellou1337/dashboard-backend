import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskWithDetails } from './types/task.types';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskWithDetails> {
    await this.checkProjectAccess(projectId, userId);

    if (createTaskDto.assignedTo) {
      await this.checkUserIsProjectMember(projectId, createTaskDto.assignedTo);
    }

    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        projectId,
        createdBy: userId,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      },
      include: {
        assignee: true,
        creator: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return task;
  }

  async findAllInProject(
    projectId: string,
    userId: string,
  ): Promise<TaskWithDetails[]> {
    await this.checkProjectAccess(projectId, userId);

    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignee: true,
        creator: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }

  async findMyTasks(userId: string): Promise<TaskWithDetails[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [{ assignedTo: userId }, { createdBy: userId }],
        project: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        assignee: true,
        creator: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }

  async findOne(id: string, userId: string): Promise<TaskWithDetails> {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        project: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        assignee: true,
        creator: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskWithDetails> {
    const task = await this.findOne(id, userId);

    const canEdit = task.createdBy === userId || task.assignedTo === userId;
    if (!canEdit) {
      throw new ForbiddenException(
        'Only task creator or assignee can edit this task',
      );
    }

    if (updateTaskDto.assignedTo) {
      await this.checkUserIsProjectMember(
        task.projectId,
        updateTaskDto.assignedTo,
      );
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
      include: {
        assignee: true,
        creator: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);

    if (task.createdBy !== userId) {
      throw new ForbiddenException('Only task creator can delete this task');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  private async checkProjectAccess(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const memberExists = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (!memberExists) {
      throw new NotFoundException('Project not found or access denied');
    }
  }

  private async checkUserIsProjectMember(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const memberExists = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (!memberExists) {
      throw new BadRequestException('User is not a member of this project');
    }
  }
}
