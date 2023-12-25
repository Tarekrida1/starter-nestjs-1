import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // console.log('roleees', roles)
    // if (!roles) {
    //   return true;
    // }

    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    // console.log('user', user)
    // console.log('roles', roles)
    if(!user || !user.roles.length || !roles.length) {
      return false
    }
    return checkRole(user.roles,roles)
  }
}


export const checkRole = (currntUserRoles:string[], authRoles:string[] )=> {
  if (currntUserRoles.length && currntUserRoles.length) {
    for (const checkRole of currntUserRoles) {
      const roleFound = authRoles.find(x => x.toUpperCase() === checkRole.toUpperCase());
      console.log('roleFound', roleFound)
      if (roleFound) {
        return true;
      }
    }
  }
  return false;
}
