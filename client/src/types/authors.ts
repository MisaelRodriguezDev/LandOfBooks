import type { BaseOut } from "./common";
import type { ApiResponse } from "./api";

export interface Author extends BaseOut {
    first_name: string;
    last_name: string;
    pseudonym?: string;
    photo?: string;
    birth_date?: string;
    biography?: string;
    nationality?: string;
}

export type GetAllAuthorResponse = ApiResponse<Author[]>;