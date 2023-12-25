import { RoleEnum } from './../../../interfaces/enums/role.enum';
import { ChangeToSlug } from './../../../commons/helpers/helpers';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Next,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthRes, AuthUser, RequestWithUser } from '@interfaces';
import { ApiBody, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private httpService:HttpService
  ) {}
  @Post('register')
  @ApiBody({type: User})
  create(@Body() user: User) {
    return this.usersService.register(user);
  }


  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    let user : User | AuthUser = await this.usersService.getByEmail(email);
    if (!user) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }
console.log('password', password)
console.log('user.password', user.password)
    const isPasswordMatching = await this.verifyPassword(
      String(password),
      String(user.password)
    );
    console.log('isPasswordMatching', isPasswordMatching)
    if (!isPasswordMatching) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }
    user = new  AuthUser(user);
    const jwt = await this.generateJwtToken({...user});
    const authRes: AuthRes = {
      user: user,
      token: jwt,
    };
    return authRes;
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Req() request: RequestWithUser
  ) {
    if (!request?.user?._id) {
      throw new NotFoundException()
    }
    const user = await this.usersService.findOne(request?.user?._id);
    if (!user) {
      throw new NotFoundException()
    }
    user.password = undefined;
    return {
      success: true,
      data: user,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  async updateProfile(
    @Req() request: RequestWithUser,@Body() userData:User| AuthUser
  ) {
    if (!request?.user?._id) {
      throw new NotFoundException()
    }
    const user = await this.usersService.findOne(request?.user?._id);
    if (!user) {
      throw new NotFoundException()
    }
        if (userData && userData.password) {
      delete userData.password
    }
    if (userData && userData.roles) {
      delete userData.roles
    }
    userData.slug_en = ChangeToSlug(userData?.name);

    console.log('userData', userData)
    const item = await this.usersService.update(request?.user?._id, userData);
    return {
      success: true,
      data: item,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('password/update')
  async updatePassword(
    @Req() request: RequestWithUser,@Body() userData:any
  ) {
    if (!request?.user?._id) {
      throw new NotFoundException()
    }
    const user = await this.usersService.findOne(request?.user?._id);
    console.log('userData', userData)
    if (!user) {
      throw new NotFoundException()
    }
      
    if (userData && userData.roles) {
      delete userData.roles
    }
    console.log('userData', userData)
    const item = await this.usersService.updateWithPassword(request?.user?._id,userData);
    // item.password = undefined;

    userData = new  AuthUser(item);
    const jwt = await this.generateJwtToken({...userData});
    const authRes: AuthRes = {
      user: userData,
      token: jwt,
    };
    return authRes;
   
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(
      String(plainTextPassword),
      String(hashedPassword)
    );
  }
  // this method well be used in different methods
  async generateJwtToken(user:User| AuthUser) {
    const payload: JwtPayload = {_id: user._id, email:user.email, name:user.name, roles: user.roles};
    const jwt = await this.jwtService.sign(payload);
    return jwt;
  }


}
