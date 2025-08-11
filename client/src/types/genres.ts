import type { BaseOut } from "./common";
import type { ApiResponse } from "./api";

export interface Genre extends BaseOut {
    name: string;
    description?: string;
    enabled: boolean;
}

export type GetAllGenresResponse = ApiResponse<Genre[]>;