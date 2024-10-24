import { HttpException, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(userInfo: any) {
    const payload = {
      username: userInfo.username,
      name: userInfo.name,
    };

    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new HttpException('Invalid token', 401);
    }
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
