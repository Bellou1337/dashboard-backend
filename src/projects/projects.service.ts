import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, AddMemberDto } from './dto';
import { ProjectWithDetails } from './types/project.types';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectWithDetails> {
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        createdBy: userId,
        members: {
          create: {
            userId: userId,
          },
        },
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    return project;
  }

  async findAllForUser(userId: string): Promise<ProjectWithDetails[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    return projects;
  }

  async findOne(id: string, userId: string): Promise<ProjectWithDetails> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<ProjectWithDetails> {
    await this.checkProjectAccess(id, userId);

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.createdBy !== userId) {
      throw new ForbiddenException(
        'Only project creator can edit this project',
      );
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    return updatedProject;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.checkProjectAccess(id, userId);

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.createdBy !== userId) {
      throw new ForbiddenException(
        'Only project creator can delete this project',
      );
    }

    await this.prisma.project.delete({
      where: { id },
    });
  }

  async addMember(
    id: string,
    addMemberDto: AddMemberDto,
    userId: string,
  ): Promise<ProjectWithDetails> {
    await this.checkProjectAccess(id, userId);

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.createdBy !== userId) {
      throw new ForbiddenException('Only project creator can add members');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: addMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: addMemberDto.userId,
          projectId: id,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this project');
    }

    await this.prisma.projectMember.create({
      data: {
        projectId: id,
        userId: addMemberDto.userId,
      },
    });

    return this.findOne(id, userId);
  }

  async removeMember(
    id: string,
    memberUserId: string,
    userId: string,
  ): Promise<ProjectWithDetails> {
    await this.checkProjectAccess(id, userId);

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.createdBy !== userId) {
      throw new ForbiddenException('Only project creator can remove members');
    }

    if (memberUserId === userId) {
      throw new BadRequestException(
        'Project creator cannot remove themselves from project',
      );
    }

    const projectMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: memberUserId,
          projectId: id,
        },
      },
    });

    if (!projectMember) {
      throw new NotFoundException('Member not found in project');
    }

    await this.prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: memberUserId,
          projectId: id,
        },
      },
    });

    return this.findOne(id, userId);
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
}
