import { PrismaService } from '../../database/prisma.service';

export interface IBaseRepository<T, CreateData = unknown, UpdateData = unknown> {
  create(data: CreateData): Promise<T>;
  findById(id: string | number): Promise<T | null>;
  findMany(): Promise<T[]>;
  update(id: string | number, data: UpdateData): Promise<T>;
  delete(id: string | number): Promise<T>;
}

export abstract class BaseRepository<T, CreateData = unknown, UpdateData = unknown> implements IBaseRepository<T, CreateData, UpdateData> {
  constructor(protected readonly prisma: PrismaService) { }

  abstract create(data: CreateData): Promise<T>;
  abstract findById(id: string | number): Promise<T | null>;
  abstract findMany(): Promise<T[]>;
  abstract update(id: string | number, data: UpdateData): Promise<T>;
  abstract delete(id: string | number): Promise<T>;
}
