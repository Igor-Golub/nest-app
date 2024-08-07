import { FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { FiltersType } from '../../common/enums';

@Injectable()
export class ClientFilterService<ViewEntity> {
  private mangoMapper: Record<
    FiltersType,
    (...args: any) => Partial<FilterQuery<any>>
  > = {
    [FiltersType.ById]: (field, value) => ({
      [field]: value,
    }),
    [FiltersType.InnerText]: (field, value) => ({
      [field]: {
        $regex: value ?? '',
        $options: 'i',
      },
    }),
    [FiltersType.OrAndInnerText]: (
      data: Record<string, string | undefined>,
    ) => {
      const filter = Object.entries(data)
        .filter(([, value]) => Boolean(value))
        .map(([field, value]) => ({
          [field]: { $regex: value ?? '', $options: 'i' },
        }));

      return filter.length ? { $or: filter } : {};
    },
  };

  private value: FilterQuery<ViewEntity> = {};

  private reset() {
    this.value = {};
  }

  public setValue(filed: string, value: string | null, type: FiltersType) {
    this.value = this.mangoMapper[type](filed, value);
  }

  public setValues(data: Record<string, string | null>, type: FiltersType) {
    this.value = this.mangoMapper[type](data);
  }

  public getFilters(): FilterQuery<ViewEntity> {
    const value = this.value;

    this.reset();

    return value;
  }
}
