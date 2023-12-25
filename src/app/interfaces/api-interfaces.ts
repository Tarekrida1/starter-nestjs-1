import {  FormBuilderTypeEnum, ListsTypeEnum } from "./enums/lists.enum";
import { RoleEnum } from "./enums/role.enum";
import { Request } from 'express';

export interface Message {
  message: string;
}
export interface AuthRes {
  user: User | AuthUser,
  token: string
}

export class ApiRes {
  success: boolean | null = null;
  total:number | null = 0;
  data: unknown | null = null;
  constructor(data?) {
    if(data) {
      this.success = data?.success || false;
      this.total = data?.total || data?.count || 0;
      this.data = data?.data || [];
    }
  }
}
export const setAggregateResult = (allData?:unknown[]): ApiRes => {
    if(allData && allData?.length) {
      return new ApiRes({
        success: true,
        total: allData[0]['total'] || 0,
        data: allData[0]['data'],
      });
    } else {
      return new ApiRes({
        success: true,
        data: [],
        total: 0,
      });
    }
}


export interface User {
  _id: string;
  password: string;
  name: string;
  createdAt?: Date | string;
  email: string;
  roles: string[];
}

export interface  ModifiedQuery {
  query: any;
  sort:unknown,
  page: number,
  limit: number,
  skip: number,
}
export const Role = RoleEnum ;
export const ListsTypesEnum = ListsTypeEnum ;
export const FormBuilderTypesEnum = FormBuilderTypeEnum ;




export class AuthUser {
  _id: string;
  email: string;
  slug_en?: string;
  name: string;
  password?: string;
  roles: string[];
  createdAt?: Date | string;
  constructor(data?:any) {
    if(data) {
      this._id = data?._id ;
      this.email = data?.email ;
      this.name = data?.name ;
      this.roles = data?.roles ;
      this.createdAt = data?.createdAt ;
    }
  }
}


export interface RequestWithUser extends Request {
  user: User
}
