import { Module } from '@nestjs/common';

import { UserModule } from './modules/User/user.module';
import { TaskModule } from './modules/Task/task.module';
import { AuthModule } from './modules/Auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule
  ]
})
export class AppModule {}
