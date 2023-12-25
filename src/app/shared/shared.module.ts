import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [UsersModule,FilesModule, ListModule],
  exports: [UsersModule,FilesModule],
  providers: []

})
export class SharedModule {

}
