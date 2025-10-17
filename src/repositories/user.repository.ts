import { Injectable, BadRequestException } from '@nestjs/common';
import { User, Prisma } from 'generated/prisma';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_MESSAGES, PAGINATION } from '../constants';


@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }


  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.findByEmail(data.email);
    if (user) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.EMAIL_ALREADY_EXISTS);
    }
    return this.prisma.user.create({ data });
  }


  async findById(id: string): Promise<User | null> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.INVALID_ID);
    }

    return this.prisma.user.findUnique({
      where: { id },
      include: { movies: true }
    });
  }


  async findByEmail(email: string): Promise<User | null> {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
    }

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
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.INVALID_ID);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: { movies: true }
    });
  }


  async delete(id: string): Promise<User> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.INVALID_ID);
    }

    return this.prisma.user.delete({
      where: { id }
    });
  }


  async findManyWithPagination(skip: number, take: number): Promise<User[]> {
    if (skip < 0 || take <= 0 || take > PAGINATION.MAX_LIMIT) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.INVALID_LIMIT);
    }

    return this.prisma.user.findMany({
      skip,
      take,
      include: { movies: true },
      orderBy: { createdAt: 'desc' }
    });
  }


  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}
