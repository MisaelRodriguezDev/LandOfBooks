import type { ApiResponse } from "./api";
import type { UserProfile } from "./user";

export type CreateUserResponse = ApiResponse<string>;
export type UpdateUserFromAdminResponse = ApiResponse<UserProfile>;
export type ChangeUserRoleResponse = ApiResponse<string>;
