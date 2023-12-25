import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './entities/file.entity';
import { environment } from '../../..//environments/environment';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
      MulterModule.register({
      dest: environment.uploadedFilesDir,
    })],
  controllers: [FilesController],
  providers: [FilesService],
  exports:[FilesService]
})
export class FilesModule {}
