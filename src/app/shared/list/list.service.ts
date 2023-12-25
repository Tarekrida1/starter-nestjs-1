import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiRes, ModifiedQuery, setAggregateResult } from '@interfaces';
import { aggRes, ChangeToSlug, Glookup, modifiedQuery, selectedFields } from '../../commons/helpers/helpers';
import { List } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(@InjectModel('List') private readonly model: Model<List>) {}

  async findAll(query): Promise<ApiRes> {
    const queryObj: ModifiedQuery = modifiedQuery(query, []);
    const allData:unknown[] = await this.model.aggregate([
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
            ...Glookup('files', 'featuredImage'),

            selectedFields(['_id','parent','name_en','featuredImage','enum','type','createdAt',])
          ],
        },
      },
    ...aggRes()
    ]);
    return   setAggregateResult(allData);
  }

  async findOne(_id: string): Promise<List> {
    const item = await this.model.findOne({ _id });
    if (item) {
      return item;
    }
    throw new HttpException('List item with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async create(itemData: List): Promise<List> {
    itemData.slug_en = ChangeToSlug(itemData?.name_en);
    const item = new this.model(itemData);
    return item.save();
  }
  async createMany(itemData: List[]): Promise<List[]> {
    return this.model.insertMany(itemData);
  }

  async remove(_id: string): Promise<List> {
    const item = await this.model.findByIdAndRemove(_id);
    if(!item) {
      throw new HttpException('list with id '+_id+' not found' , HttpStatus.NOT_FOUND);
    }
    return item;
  }

  async update(_id: string, data: List): Promise<List> {
    const item = await this.model.findByIdAndUpdate(_id, data, { new: true });
    return item;
  }
}
