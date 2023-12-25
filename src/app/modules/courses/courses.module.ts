import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseSchema } from './entities/course.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Course', schema: CourseSchema}])],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
