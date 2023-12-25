import { Role } from '@interfaces';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { RolesGuard } from '../users/auth/roles.guard';
import { List } from './entities/list.entity';
import { ListService } from './list.service';

@ApiTags('lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  create(@Body() item: List) {
    return this.listService.create(item);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('many')
  createMany(@Body() items: List[]) {
    return this.listService.createMany(items);
  }


  @Get()
  async findAll(@Query() query: List) {
    return await  this.listService.findAll(query);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listService.findOne(id);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() item: List) {
    return this.listService.update(id, item);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.remove(id);
  }
}
