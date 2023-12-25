import { RequestWithUser, Role } from '@app/interfaces';
import { Roles } from '@app/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@app/shared/users/auth/jwt-auth.guard';
import { RolesGuard } from '@app/shared/users/auth/roles.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createmainServiceDto: Course,
    @Req() request: RequestWithUser,
  ) {
    createmainServiceDto.added_by = request?.user?._id as any;
    return this.coursesService.create(createmainServiceDto, request);
  }

  @Get()
  async findAll(@Query() query: Course) {
    return await this.coursesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatemainServiceDto: Course) {
    return this.coursesService.update(id, updatemainServiceDto);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

}
