import { aggRes, modifiedQuery, selectedFields } from './../../commons/helpers/helpers';
import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { File, FileDocument } from './entities/file.entity';
import { mongoErrorHandler } from '../error-handler/mongodb.errors';
import { ModifiedQuery, RequestWithUser, Role, setAggregateResult } from '@app/interfaces';
import * as mongoose from 'mongoose';
import { environment } from 'src/environments/environment';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private readonly model: Model<FileDocument>) {}
  async create(filesArr: File[]) {
    try {
      const files = await this.model.insertMany(filesArr);
      return {
        data: files
      };
    } catch (error) {
      mongoErrorHandler(error)
    }
  }



  async findOne(id:string) : Promise<File> {
    const file = await this.model.findOne({ id });
    if (file) {
      return file;
    }
    throw new HttpException('File with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getByEmail(email: string) {
    const user = await this.model.findOne({ email });
      return user;
  }




  update(id: string, user: File) {
    return `This action updates a #${id} user ${user}`;
  }

  async remove(_id: string): Promise<File> {
    const item = await this.model.findByIdAndRemove(_id);
    // const item = await this.model.findById(_id);
    if(!item) {
      throw new HttpException('File with id '+_id+' not found' , HttpStatus.NOT_FOUND);
    }
    
const filePath = environment.uploadedFilesDir+'/'+item.serving;
  
fs.exists(filePath, function(exists) {
  if(exists) {
      console.log('File exists. Deleting now ...');
      fs.unlinkSync(filePath);
  } else {
      console.log('File not found, so not deleting.');
  }
});
    return item;
  }



}

