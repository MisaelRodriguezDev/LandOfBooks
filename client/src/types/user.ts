import type { UUID } from "crypto";

export interface UserProfile {
    id: UUID;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    image_url: string;
    mfa_active: boolean;
    enabled: boolean;
    role: Role;
    created_at: Date;
    updated_at: Date;
    [key: string]: string | number | boolean | Date | undefined;
}

export interface GetUser {
    status: number;
    data: UserProfile;
}

export interface GetAllUsers {
    status: number;
    data: UserProfile[];
}


export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    image_url?: string;
    mfa_active?: boolean;
}

export interface UserUpdateResponse {
    status: number;
    data: UserProfile
}

export const Roles = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  USER: 'user'
} as const;

export type Role = typeof Roles[keyof typeof Roles];