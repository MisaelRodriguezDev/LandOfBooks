import type { BaseOut } from "./common";
import type { ApiResponse } from "./api";
import type { Genre } from "./genres";
import type { Publisher } from "./publishers";
import type { Author } from "./authors";

export interface Book extends BaseOut {
    isbn: string;
    title: string;
    description: string;
    cover: string;
    year_of_publication: number;
    genres: Genre[];
    publisher: Publisher;
    authors: Author[];
}

export type GetAllBooksResponse = ApiResponse<Book[]>;