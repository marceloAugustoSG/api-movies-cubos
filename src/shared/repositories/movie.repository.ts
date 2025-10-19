import { Injectable } from '@nestjs/common';
import { Movie, Prisma } from 'generated/prisma';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../../database/prisma.service';
import { MovieFilterDto } from '../../modules/movie/dto/movie-filter.dto';

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

  async findManyPaginated(page: number = 1, limit: number = 10): Promise<{ movies: Movie[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.movie.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      movies,
      total,
      totalPages
    };
  }

  async findManyWithFilters(filters: MovieFilterDto): Promise<Movie[]> {
    const where = this.buildWhereClause(filters);
    
    return this.prisma.movie.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findManyWithFiltersPaginated(
    filters: MovieFilterDto, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ movies: Movie[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    
    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.movie.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      movies,
      total,
      totalPages
    };
  }

  private buildWhereClause(filters: MovieFilterDto): Prisma.MovieWhereInput {
    const where: Prisma.MovieWhereInput = {};

    if (filters.title) {
      where.title = {
        contains: filters.title
      };
    }

    if (filters.originalTitle) {
      where.originalTitle = {
        contains: filters.originalTitle
      };
    }

    if (filters.description) {
      where.description = {
        contains: filters.description
      };
    }

    if (filters.releaseYear) {
      const startDate = new Date(filters.releaseYear, 0, 1);
      const endDate = new Date(filters.releaseYear, 11, 31, 23, 59, 59);
      where.releaseDate = {
        gte: startDate,
        lte: endDate
      };
    }

    if (filters.releaseDateStart || filters.releaseDateEnd) {
      where.releaseDate = {};
      if (filters.releaseDateStart) {
        where.releaseDate.gte = new Date(filters.releaseDateStart);
      }
      if (filters.releaseDateEnd) {
        where.releaseDate.lte = new Date(filters.releaseDateEnd);
      }
    }

    if (filters.minDuration || filters.maxDuration) {
      where.duration = {};
      if (filters.minDuration) {
        where.duration.gte = filters.minDuration;
      }
      if (filters.maxDuration) {
        where.duration.lte = filters.maxDuration;
      }
    }

    if (filters.minBudget || filters.maxBudget) {
      where.budget = {};
      if (filters.minBudget) {
        where.budget.gte = filters.minBudget;
      }
      if (filters.maxBudget) {
        where.budget.lte = filters.maxBudget;
      }
    }

    if (filters.minRating || filters.maxRating) {
      where.rating = {};
      if (filters.minRating) {
        where.rating.gte = filters.minRating;
      }
      if (filters.maxRating) {
        where.rating.lte = filters.maxRating;
      }
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.genres) {
      where.genres = {
        contains: filters.genres
      };
    }

    return where;
  }

  async findByUserId(userId: string): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findManyByUserIdPaginated(userId: string, page: number = 1, limit: number = 10): Promise<{ movies: Movie[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.movie.count({
        where: { userId }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      movies,
      total,
      totalPages
    };
  }

  async findByIdAndUserId(id: number, userId: string): Promise<Movie | null> {
    return this.prisma.movie.findFirst({
      where: { 
        id,
        userId 
      },
      include: { user: true }
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
