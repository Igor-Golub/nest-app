import { Injectable } from '@nestjs/common';
import { Sort, SortDirection } from 'mongodb';

@Injectable()
export class ClientSortingService {
  public value: Api.Sorting = {
    sortBy: '_id',
    sortDirection: 'desc',
  };

  public setValue(key: string | undefined, value: SortDirection | undefined) {
    this.value.sortBy = key || '_id';
    this.value.sortDirection = value ?? 'desc';
  }

  public createSortCondition(): Sort {
    return {
      [this.value.sortBy]: this.value.sortDirection,
    };
  }
}
