import { PrismaService } from '../../database/prisma.service';

export interface IBaseRepository<T> {
  create(data: any): Promise<T>;
  findById(id: string | number): Promise<T | null>;
  findMany(): Promise<T[]>;
  update(id: string | number, data: any): Promise<T>;
  delete(id: string | number): Promise<T>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly prisma: PrismaService) { }

  abstract create(data: any): Promise<T>;
  abstract findById(id: string | number): Promise<T | null>;
  abstract findMany(): Promise<T[]>;
  abstract update(id: string | number, data: any): Promise<T>;
  abstract delete(id: string | number): Promise<T>;
}
