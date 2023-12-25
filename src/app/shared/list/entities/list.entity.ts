import { ListsTypesEnum } from '@interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { File } from '../../files/entities/file.entity';
export type FileDocument = List & Document;

@Schema()
export class List {
  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add en name'],unique:true })
  name_en: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ required: [false, 'please add en desc'] })
  desc_en: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add en slug'] })
  slug_en: string;

  @ApiProperty({
    required: false,
  })
  @Prop({
    enum: [...Object.values(ListsTypesEnum)],
    required: [true, 'Please Select  Type'],
  })
  type: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ default: new Date().toISOString() })
  createdAt: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  featuredImage: File;

  @ApiProperty({
    required: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'List' })
  parent?: List;
}

export const ListSchema = SchemaFactory.createForClass(List);
