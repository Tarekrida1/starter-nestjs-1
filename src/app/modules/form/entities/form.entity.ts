import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export type FileDocument = Form & Document;

@Schema()
export class Form {
  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add first name'] })
  firstName: string;

  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add last name'] })
  lastName: string;


  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add email'] })
  email: string;

  @ApiProperty({
    required: false,
  })
  @Prop({})
  phone: string;
  @ApiProperty({
    required: false,
  })
  @Prop({ required: [true, 'please add message'] })
  message: string;


  @ApiProperty({
    required: false,
  })
  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
