import { FormService } from './form.service';
import { RequestWithUser, Role } from '@app/interfaces';
import { Roles } from '@app/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@app/shared/users/auth/jwt-auth.guard';
import { RolesGuard } from '@app/shared/users/auth/roles.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Form } from './entities/form.entity';

@ApiTags('form')
@Controller('form')
export class FormController {
    constructor(private readonly coursesService: FormService) {}
  
    @Post()
    create(
      @Body() createmainServiceDto: Form,
      @Req() request: RequestWithUser,
    ) {
      return this.coursesService.create(createmainServiceDto, request);
    }
  
    @Get()
    async findAll(@Query() query: Form) {
      return await this.coursesService.findAll(query);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.coursesService.findOne(id);
    }
  
    @Roles([Role.admin])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatemainServiceDto: Form) {
      return this.coursesService.update(id, updatemainServiceDto);
    }
  
    @Roles([Role.admin])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.coursesService.remove(id);
    }
  
  }
  