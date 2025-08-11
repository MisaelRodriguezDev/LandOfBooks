import type { BaseOut } from "./common";
import type { ApiResponse } from "./api";

export interface Publisher extends BaseOut {
    name: string;
    phone?: string;
    image_url?: string;
}

export type GetAllPublishersResponse = ApiResponse<Publisher[]>