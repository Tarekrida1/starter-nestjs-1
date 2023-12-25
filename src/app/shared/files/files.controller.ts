import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  HttpException,
  HttpStatus,
  // UseGuards,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File } from './entities/file.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { environment } from '../../../environments/environment';
import { RequestWithUser, Role } from '@app/interfaces';
import { RolesGuard } from '../users/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
// import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
// import { Role } from '@interfaces';
// import { Roles } from '../decorators/roles.decorator';
// import { RolesGuard } from '../users/auth/roles.guard';
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Roles([Role.user, Role.admin])
  // @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('upload')
  @ApiBody({type:CreateFileDto})
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: environment.uploadedFilesDir,

        filename: (req, file, callback) => {
          console.log('filefile', file, file.size)
          console.log("upload fileFilter req ::", req.files); 

          // const name = file.originalname.split('.')[0];
          const filetype = checkFileType(`${file.mimetype}`.toLowerCase());
          if (!filetype) {
            callback(
              new HttpException(
                `Unsupported file type ${extname(file.originalname)}`,
                HttpStatus.NOT_ACCEPTABLE
              ),
              ''
            );
          }
          callback(
            null,
            'file_' +
              Date.now() +
              '_' +
              // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
              Math.floor(Math.random() * 795487521214793119) +
              '.' +
              filetype
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!`${file.originalname}`.toLowerCase().match(/\.(jpg|jpeg|png|gif|zip|svg|pdf|xlsx|xls)$/)) {
          cb(
            new HttpException(
              `Unsupported file type... ${extname(file.originalname)}`,
              HttpStatus.NOT_ACCEPTABLE
            ),
            false
          );
        } else {
          cb(null, true);
        }
      },
      // limits: { fileSize: 1024 * 1024 },
    })
  )


  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: environment.uploadedFilesDir });
  }


  
@Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}

export const checkFileType = (mimetype: string) => {
  console.log('mimetype', mimetype)
  if (mimetype === 'image/png') {
    return 'png';
  } else if (mimetype === 'image/jpeg') {
    return 'jpg';
  }  else if (mimetype === 'image/jpg') {
    return 'jpg';
  } else if (mimetype === 'application/pdf') {
    return 'pdf';
  } else if (mimetype === 'application/zip') {
    return 'zip';
  }  else if (mimetype === 'image/svg+xml') {
    return 'svg';
    // application/pdf,
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return 'xlsx';
  }  else if (mimetype === 'application/vnd.ms-excel') {
    return 'xls';
  }   else if (mimetype === 'application/pdf') {
    return 'pdf';
  }  else {
    return mimetype;
  }
};
// application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
