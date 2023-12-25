import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceSchema } from './entities/service.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Service', schema: ServiceSchema}])],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
