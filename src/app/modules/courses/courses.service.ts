import { Glookup } from './../../commons/helpers/helpers';
import { aggRes, ChangeToSlug, modifiedQuery, selectedFields } from '@app/commons/helpers/helpers';
import { ApiRes, ModifiedQuery, RequestWithUser, setAggregateResult } from '@app/interfaces';
import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './entities/course.entity';


@Injectable()
export class CoursesService {
  constructor(@InjectModel('Course') private readonly model: Model<Course>) {}

  async findAll(query): Promise<ApiRes> {
    const queryObj: ModifiedQuery = modifiedQuery(query, [], [], []);
    console.log('queryObj.query', queryObj.query);
    const allData: unknown[] = await this.model.aggregate([
      { $match: queryObj.query },
      {
        $sort: queryObj.sort,
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          data: [
            {
              $skip: queryObj.skip,
            },
            { $limit: queryObj.limit },
            ...Glookup('files', 'banner'),
            ...Glookup('users', 'added_by'),
            selectedFields([
              '_id',
              'name_en',
              'name_ar',
              'slug_en',
              'description_en',
              'description_ar',
              'age_from',
              'age_to',
              'level',
              'hours',

              'banner',
              'createdAt',
              'added_by.name',
              'excerpt_en',
              'read_min',
            ]),
          ],
        },
      },
      ...aggRes(),
    ]);
    return setAggregateResult(allData);
  }

  async findOne(_id: string): Promise<Course> {
    const item: any = await this.model
      .findOne({ _id })
      .populate(['banner', 'added_by']);

    if (item) {
      item['added_by'] = {
        name: item.added_by.name || '',
      } as any;
      return {
        ...item._doc,
        added_by: {
          name: item?.added_by?.name,
        } as any,
      };
    }
    throw new HttpException(
      'Service item with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(
    itemData: Course,
    @Req() request: RequestWithUser,
  ): Promise<Course> {
    itemData.slug_en = ChangeToSlug(itemData?.name_en);
    const item = new this.model(itemData);

    return item.save();
  }


  async remove(_id: string): Promise<Course> {
    const item = await this.model.findByIdAndRemove(_id);
    if (!item) {
      throw new HttpException(
        'list with id ' + _id + ' not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return item;
  }

  async update(_id: string, data: Course): Promise<Course> {
    if (data.added_by) {
      delete data.added_by;
    }

    const item: Course = await this.model.findByIdAndUpdate(_id, data, {
      new: true,
    });

    return item;
  }
}
