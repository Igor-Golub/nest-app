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
        data: Record<keyof ViewEntity | string, string | null>,
        type: FiltersType,
      );
      getFilters(): FilterQuery<ViewEntity>;
    }

    interface HttpError {
      field: string;
      message: string;
    }

    interface ErrorResponse {
      errorsMessages: HttpError[];
    }
  }
}
