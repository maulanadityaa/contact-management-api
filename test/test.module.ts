import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { JwtAuthModule } from '../src/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  providers: [TestService],
})
export class TestModule {}
