import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
