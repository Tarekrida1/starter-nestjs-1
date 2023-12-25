import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { File } from '@app/shared/files/entities/file.entity';
import { User } from '@app/shared/users/entities/user.entity';
export type FileDocument = Course & Document;

@Schema()
export class Course {
  @ApiProperty({
    required: true,
  })
  @Prop({ required: [true, 'please add ar name'], unique: true })
  name_ar: string;
  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add en name'], unique: true })
  name_en: string;

  @ApiProperty({
    required: false,
  })
  @Prop({})
  description_en: string;
  @ApiProperty({
    required: false,
  })
  @Prop({})
  description_ar: string;

  @ApiProperty({
    required: false,
  })
  @Prop({})
  excerpt_en: string;

  @ApiProperty({
    required: false,
  })
  @Prop({})
  type: string;

  @ApiProperty({
    required: false,
  })
  @Prop({})
  age_from: number;
  @ApiProperty({
    required: false,
  })
  @Prop({})
  age_to: number;

  @ApiProperty({
    required: false,
  })
  @Prop({ default: 0 })
  level: number;

  @ApiProperty({
    required: false,
  })

  @Prop({ default: 0 })
  hours: number;

  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add en slug'], unique: true })
  slug_en: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  banner?: File;

  @ApiProperty({
    required: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  added_by?: User;

  @ApiProperty({
    required: false,
  })
  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
