import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';
export type UserDocument = User & Document;
import { Role } from '@interfaces';
import { ApiProperty } from '@nestjs/swagger';
// import { File } from '@app/shared/files/entities/file.entity';

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  @ApiProperty({
    required: false,
  })
  _id?: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ unique: true, required: true })
  @ApiProperty({
    required: false,
  })
  email: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ required: true })
  @ApiProperty({
    required: false,
  })
  name: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ required: false })
  @ApiProperty({
    required: false,
  })
  @Exclude()
  password?: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ type: [String], enum: [...Object.values(Role)] })
  @ApiProperty({
    required: false,
  })
  roles: string[];

  @ApiProperty({
    required: false,
  })




  @Prop({ required: false })
  @ApiProperty({
    required: false,
  })
  language?: string;


  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add en slug'], unique: true })
  slug_en?: string;




  @ApiProperty({
    required: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  img?: string;




  @Prop({ default: new Date().toISOString() })
  createdAt?: string;


}

export const UserSchema = SchemaFactory.createForClass(User);
