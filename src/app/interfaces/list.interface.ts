import { Document } from "mongoose";

export interface List extends Document {
     _id?: string;
     name: string;
     description: string;
     imageURL: string;
     price: number;
     createdAt: Date;
}
