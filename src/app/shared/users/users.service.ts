import { RoleEnum } from './../../interfaces/enums/role.enum';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { mongoErrorHandler } from '../error-handler/mongodb.errors';
import { Logger } from 'winston';
import { ApiRes, AuthUser, ModifiedQuery, setAggregateResult } from '@interfaces';
import { ChangeToSlug, Glookup, aggRes, generateRandomNumber, modifiedQuery, selectedFields } from '@app/commons/helpers/helpers';
import { NextFunction, Request, Response } from 'express';
import { environment } from 'src/environments/environment';


@Injectable()
export class UsersService {
  constructor(@InjectModel('User')  readonly model: Model<UserDocument>,
  @Inject('winston')
  private readonly logger: Logger
  ) {
    // this.model.updateMany({},
    //   { "sub_services": { "$ne": { "$type": "array" } } },
    //   { "$set": { "sub_services": [] } },
    //   // { "multi": true }
    // )

  }
  async create(user: User): Promise<User> {
    console.log('useruser', user)
    user.slug_en = ChangeToSlug(user?.name);

    const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

    const createdUser = new this.model(user);
    return createdUser.save();
  }
  
  async createMember(user: User): Promise<User> {
    console.log('useruser', user)
    const userData = await this.model.findOne({ email:user.email }).populate(['img']);;
    if (userData) {
      return userData;
    }
    user.slug_en = ChangeToSlug(user?.name);

    const createdUser = new this.model(user);
    return createdUser.save();
  }
  async generateRandomUser(roles: string[],name?:string): Promise<User> {
    const user :User = {
      email: `${generateRandomNumber()}`,
      name:name,
      roles :roles,
    }

    const createdUser = new this.model(user);
    return createdUser.save();
  }

//  findAll(filterQuery: FilterQuery<User>) : Promise<User> {
//     return this.model.findOne(filterQuery)
//   }
  // async findAll(query): Promise<{ data: User[]; }> {
  //   console.log('queryqueryquery', query)
  //   const queryData:any = {};
  //   if(query.roles) {
  //     queryData.roles = {"$in":`${query.roles}`.split(',')}
  //   }
  //   console.log('queryData', queryData)
  //  const  data = await this.model.find(queryData).populate([]).select(['-password']).exec()

  //   return {data };
  // }
  async findAll(query): Promise<ApiRes> {

    const queryObj: ModifiedQuery = modifiedQuery(query, [],[],[]);
    if(queryObj.query.roles) {
      queryObj.query.roles = {"$in":`${query.roles}`.split(',')}
    }
      console.log('queryObj.query', queryObj.query)
      const allData:unknown[] = await this.model.aggregate([
        { $match: queryObj.query },
              {
                $sort: queryObj.sort,
              },
        {
  
          $facet: {
            count: [ { $count: 'count' }],
            data: [
          
            { $unwind: { path: "$casestudy", preserveNullAndEmptyArrays: true } },
              selectedFields(['_id','createdAt','email','img','name','roles','slug_en'])
            ],
          },
        },
      ...aggRes()
      ]);
      return   setAggregateResult(allData);
    }
  

  async findAllClients(query = {}): Promise<ApiRes> {

    const queryObj: ModifiedQuery = modifiedQuery(query, [],[],[]);
    console.log('queryObj.query', queryObj.query)
    queryObj.query.roles = {"$in":[RoleEnum.client]}
    const allData:unknown[] = await this.model.aggregate([
      { $match: queryObj.query },
            {
              $sort: queryObj.sort,
            },
      {

        $facet: {
          count: [ { $count: 'count' }],
          data: [
            ...Glookup('files', 'img'),
            {
              $lookup: {
                from: 'casestudies',
                localField: '_id',
                foreignField: 'client',
                as: 'casestudy',
              },
            },
            { $unwind: { path: "$casestudy", preserveNullAndEmptyArrays: true } },
            // {
            //   $skip: queryObj.skip,
            // },
            // { $limit: queryObj.limit },
            selectedFields(['name','img','casestudy'])
          ],
        },
      },
    ...aggRes()
    ]);
    return   setAggregateResult(allData);
  }


  async findOne(_id:string) : Promise<User> {
    const user = await this.model.findOne({ _id }).populate(['img']);;
    if (user) {
      return user;
    }
  
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
  async getByEmail(email: string) {
    const user = await this.model.findOne({ email });
      return user;
  }




  async update(id: string, user:User| AuthUser) {
    console.log('useruser', user)
    user.slug_en = ChangeToSlug(user?.name);

    if (user && user.password) {
      const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password =  hashedPassword;
    console.log('user.passworduser.password', user.password)
    }
    const userData = await this.model.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true
  });
    return userData
  }
 

  public async updateWithPassword(id: string,user: User) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    try {
      console.log('createdUser', user)
      const createdUser = await this.model.findByIdAndUpdate(id,{
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      this.logger.info(error?.message || '');
      mongoErrorHandler(error)
    }
  }


  // async updateProfile(user:User| AuthUser, @Req() request: RequestWithUser) {
  //   console.log('useruser', user)

  //   if (user && user.password) {
  //     delete user.password
  //   }
  //   if (user && user.roles) {
  //     delete user.roles
  //   }
  //   console.log('useruser', user)
  //   const userData = await this.model.findByIdAndUpdate(request?.user?._id, user, {
  //     new: true,
  //     runValidators: true
  // });
  //   return userData
  // }


  async remove(_id: string) {
    const item = await this.model.findByIdAndRemove(_id);
    if(!item) {
      throw new HttpException('user with id '+_id+' not found' , HttpStatus.NOT_FOUND);
    }
    return item;

  }

  public async register(user: User) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.slug_en = ChangeToSlug(user?.name);

    try {
      const createdUser = await this.model.create({
        ...user,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      this.logger.info(error?.message || '');
      mongoErrorHandler(error)
    }
  }

  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.getByEmail(email);
      const isPasswordMatching = await bcrypt.compare(
        hashedPassword,
        user.password
      );
      if (!isPasswordMatching) {
        throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }


}

