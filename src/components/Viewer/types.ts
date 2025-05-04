export interface Page {
  page_number: number;
  content_url: string;
}

export interface Chapter {
  id: string;
  pages: Page[];
}