import { User } from "@app/shared/users/entities/user.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
export type FileDocument = File & Document;

@Schema()
export class File {

    @ApiProperty({
    required:false
  })
  @Prop({required: true})
  name: string;
  @ApiProperty({
    required:false
  })
  @Prop({required: true})
  originalname?: string;

    @ApiProperty({
    required:false
  })
  @Prop({required: true})
  serving: string;

    @ApiProperty({
    required:false
  })
  @Prop({required: true})
  path: string;

  @ApiProperty({
    required:false
  })
  @Prop({required: false})
  size?: number;

    @ApiProperty({
    required:false
  })
  @Prop({required: true})
  type: string;


    @ApiProperty({
    required:false
  })
  @Prop({default: new Date().toISOString()})
  createdAt: string;
}


export const FileSchema = SchemaFactory.createForClass(File)
