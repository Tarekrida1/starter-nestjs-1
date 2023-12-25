import { Glookup } from './../../commons/helpers/helpers';
import { aggRes, ChangeToSlug, modifiedQuery, selectedFields } from '@app/commons/helpers/helpers';
import { ApiRes, ModifiedQuery, RequestWithUser, setAggregateResult } from '@app/interfaces';
import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './entities/form.entity';
@Injectable()
export class FormService {
    constructor(@InjectModel('Form') private readonly model: Model<Form>) {}
  
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
                'firstName',
                'lastName',
                'email',
                'phone',
                'message',
                'createdAt',
              ]),
            ],
          },
        },
        ...aggRes(),
      ]);
      return setAggregateResult(allData);
    }
  
    async findOne(_id: string): Promise<Form> {
      const item: any = await this.model
        .findOne({ _id })
      throw new HttpException(
        'Service item with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  
    async create(
      itemData: Form,
      @Req() request: RequestWithUser,
    ): Promise<Form> {
      const item = new this.model(itemData);
  
      return item.save();
    }
  
  
    async remove(_id: string): Promise<Form> {
      const item = await this.model.findByIdAndRemove(_id);
      if (!item) {
        throw new HttpException(
          'list with id ' + _id + ' not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return item;
    }
  
    async update(_id: string, data: Form): Promise<Form> {
  
      const item: Form = await this.model.findByIdAndUpdate(_id, data, {
        new: true,
      });
  
      return item;
    }
  }
  