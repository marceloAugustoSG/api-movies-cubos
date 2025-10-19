import { Movie, User } from 'generated/prisma';

export interface MovieResponse {
    id: number;
    title: string;
    originalTitle?: string;
    description?: string;
    releaseDate: Date;
    duration: number;
    budget?: number;
    revenue?: number;
    profit?: number;
    imageUrl?: string;
    slogan?: string;
    trailerUrl?: string;
    bannerUrl?: string;
    rating: number;
    voteCount?: number;
    ageRating?: string;
    status?: string;
    language?: string;
    genres?: string[];
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

export interface PaginatedMovieResponse {
    movies: MovieListResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}