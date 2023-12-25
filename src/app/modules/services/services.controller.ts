import { RequestWithUser, Role } from '@app/interfaces';
import { Roles } from '@app/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@app/shared/users/auth/jwt-auth.guard';
import { RolesGuard } from '@app/shared/users/auth/roles.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createmainServiceDto: Service,
    @Req() request: RequestWithUser,
  ) {
    createmainServiceDto.added_by = request?.user?._id as any;
    return this.servicesService.create(createmainServiceDto, request);
  }

  @Get()
  async findAll(@Query() query: Service) {
    return await this.servicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatemainServiceDto: Service) {
    return this.servicesService.update(id, updatemainServiceDto);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
