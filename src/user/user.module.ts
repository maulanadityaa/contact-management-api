import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthModule } from 'src/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
