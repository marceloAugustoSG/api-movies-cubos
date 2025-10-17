import { Injectable } from '@nestjs/common';
import { Movie, Prisma } from 'generated/prisma';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MovieRepository extends BaseRepository<Movie> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: Prisma.MovieCreateInput): Promise<Movie> {
    return this.prisma.movie.create({
      data,
      include: { user: true }
    });
  }

  async findById(id: number): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  async findMany(): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByUserId(userId: string): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: number, data: Prisma.MovieUpdateInput): Promise<Movie> {
    return this.prisma.movie.update({
      where: { id },
      data,
      include: { user: true }
    });
  }

  async delete(id: number): Promise<Movie> {
    return this.prisma.movie.delete({
      where: { id }
    });
  }
}
