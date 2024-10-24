import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtAuthService } from '../src/jwt/jwt.service';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private jwtAuthService: JwtAuthService,
  ) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hashSync('test', 10),
        token: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async getToken(): Promise<string> {
    const user = await this.getUser();
    return this.jwtAuthService.generateToken({
      username: user.username,
      name: user.name,
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        email: 'test@email.com',
        phone: '0813644257',
        username: 'test',
      },
    });
  }

  async getContact() {
    return this.prismaService.contact.findFirst({
      where: {
        username: 'test'
      }
    })
  }
}
