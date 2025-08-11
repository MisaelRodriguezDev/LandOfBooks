import type { UUID } from "crypto"

export interface BaseOut {
    id: UUID,
    created_at: string;
    updated_at: string;
    [key: string]: unknown;

}