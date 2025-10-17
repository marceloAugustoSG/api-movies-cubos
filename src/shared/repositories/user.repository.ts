import { Injectable, BadRequestException } from '@nestjs/common';
import { User, Prisma } from 'generated/prisma';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../../database/prisma.service';
import { ERROR_MESSAGES } from '../constants';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_ALREADY_EXISTS);
    }
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { movies: true }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { movies: true }
    });
  }

  async findMany(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { movies: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { movies: true }
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}