import { Movie, User } from 'generated/prisma';

export interface MovieResponse {
    id: number;
    title: string;
    originalTitle?: string;
    description?: string;
    releaseDate: Date;
    duration: number;
    budget?: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateMovieResponse extends MovieResponse { }

export interface UpdateMovieResponse extends MovieResponse { }

export interface FindMovieResponse extends MovieResponse { }

export interface MovieListResponse extends MovieResponse { }
