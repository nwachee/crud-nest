// src/auth/interfaces/auth.interface.ts
export interface JwtPayload {
  email: string;
  sub: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface JwtUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}
