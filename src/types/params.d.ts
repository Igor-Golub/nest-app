export declare global {
  namespace Params {
    interface URIId {
      id: string;
    }

    interface PaginationQueryParams {
      pageNumber: number;
      pageSize: number;
    }

    interface SortingQueryParams {
      sortBy: string;
      sortDirection: 'asc' | 'desc';
    }

    interface FilterQueryParams {
      searchNameTerm: string;
      searchLoginTerm: string;
      searchEmailTerm: string;
    }

    type PaginationAndSortingQueryParams = Partial<
      PaginationQueryParams & SortingQueryParams & FilterQueryParams
    >;
  }
}
