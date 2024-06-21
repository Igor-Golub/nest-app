import { SortDirection } from 'mongodb';

export declare global {
  namespace Api {
    interface Sorting {
      sortBy: string;
      sortDirection: SortDirection;
    }

    interface Pagination {
      pageNumber: number;
      pagesCount: number;
      pageSize: number;
      totalCount: number;
    }

    interface CommonQuery {
      sortBy: string;
      pageSize: number;
      pageNumber: number;
      sortDirection: 'asc' | 'desc';
    }

    interface BlogQuery extends CommonQuery {
      searchNameTerm: string | null;
    }

    interface UsersQuery extends CommonQuery {
      searchLoginTerm: string | null;
      searchEmailTerm: string | null;
    }
  }
}
