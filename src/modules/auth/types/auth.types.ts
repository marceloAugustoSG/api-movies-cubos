export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface RegisterResponse extends AuthResponse {}

export interface LoginResponse extends AuthResponse {}

export interface ValidatedUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
