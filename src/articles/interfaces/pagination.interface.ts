export interface PaginationInterface {
  page?: number;
  limit?: number;
  filters?: {
    authorId?: number;
    startDate?: Date;
    endDate?: Date;
  };
}