import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { JwtAuthModule } from './jwt/jwt.module';
@Module({
  imports: [CommonModule, UserModule, JwtAuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
