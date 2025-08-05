export interface GBook {
  title: string;
  authors: string[] | null;
  published_date: string;
  description: string;
  info_link: string;
  thumbnail: string;
}

export interface GBooksResponse {
  totalItems: number;
  results: GBook[];
}