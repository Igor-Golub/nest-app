import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../domain/userEntity';
import { PaginationService } from '../../../common/services/pagination.service';
import { ClientSortingService } from '../../../common/services/clientSorting.service';
import { ClientFilterService } from '../../../common/services/filter.service';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Blog>,
  ) {}

  public async getWithPagination() {
    const { pageNumber, pageSize } = this.paginationService.getPagination();
    const sort = this.sortingService.createSortCondition() as any;
    const filters = this.filterService.getFilters();

    const data = await this.userModel
      .find(filters)
      .sort(sort)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const amountOfItems = await this.userModel.countDocuments(filters);

    return {
      page: pageNumber,
      pageSize,
      totalCount: amountOfItems,
      items: data.map(this.mapToViewModel),
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }

  private mapToViewModel(
    data: DBModels.MongoResponseEntity<DBModels.User>,
  ): ViewModels.User {
    return {
      email: data.email,
      login: data.login,
      id: data._id.toString(),
      createdAt: data._id.getTimestamp().toISOString(),
    };
  }
}
