import { FilterQuery } from 'mongoose';
import { FiltersType, SortingDirectionStrings } from '../enums';

export declare global {
  namespace Base {
    interface SortingService {
      setValue(
        key: string | undefined,
        value: SortingDirectionStrings | undefined,
      );
      createSortCondition(): any;
    }

    interface FilterService<ViewEntity> {
      setValue(
        filed: keyof ViewEntity | string,
        value: string | null,
        type: FiltersType,
      );
      setValues(
        data: Record<keyof ViewEntity | string, string | undefined>,
        type: FiltersType,
      );
      getFilters(): FilterQuery<ViewEntity>;
    }
  }
}
