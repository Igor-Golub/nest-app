export declare global {
  namespace Api {
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
