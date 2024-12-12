export abstract class PaginatedViewDto<Item> {
  abstract items: Item;

  totalCount: number;

  pagesCount: number;

  page: number;

  pageSize: number;

  public static mapToView<Item>(data: {
    items: Item;
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<Item> {
    return {
      page: data.page,
      items: data.items,
      totalCount: data.totalCount,
      pageSize: data.size,
      pagesCount: Math.ceil(data.totalCount / data.size),
    };
  }
}
