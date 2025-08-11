import type { UUID } from "crypto";
import type { ApiResponse } from "./api";
import type { BaseOut } from "./common";

export const BCStatus = {
    AVAILABLE: 'AVAILABLE',
    LOANED: 'LOANED',
    LOST: 'LOST',
    REMOVED: 'REMOVED'
} as const;

export type BookCopyStatus = typeof BCStatus[keyof typeof BCStatus]

export interface BookCopy extends BaseOut {
    book_id: UUID;
    barcode: string;
    status: BookCopyStatus
}

export type GetAllBookCopiesResponse = ApiResponse<BookCopy[]>;
export type CreateBookCopyResponse = ApiResponse<string>;
export type GetAllBookCopiesAvailableByBookResponse = ApiResponse<BookCopy[]>;