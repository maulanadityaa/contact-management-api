import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  providers: [JwtAuthService, JwtStrategy],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
