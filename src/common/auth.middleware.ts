import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthService } from '../jwt/jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    private jwtAuthService: JwtAuthService,
  ) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader) {
      throw new HttpException('Authorization header not found', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token not found', 401);
    }

    try {
      const decoded = await this.jwtAuthService.verifyToken(token);

      const user = await this.prismaService.user.findUnique({
        where: {
          username: decoded.username,
        },
      });

      req['user'] = user;
      next();
    } catch (error) {
      throw new HttpException('Invalid or expired token', 401);
    }
  }
}
