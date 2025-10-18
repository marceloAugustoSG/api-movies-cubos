import { User, Movie } from 'generated/prisma';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  movies?: Movie[];
}

export interface CreateUserResponse extends UserResponse {}

export interface UpdateUserResponse extends UserResponse {}

export interface FindUserResponse extends UserResponse {}

export interface UserListResponse extends UserResponse {}
