import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param, ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put, Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { ContactRequest, ContactResponse, ContactSearchRequest, ContactUpdateRequest } from '../model/contact.model';
import { CommonResponse } from '../model/web.model';

@Controller('/api/v1/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(
    @Auth() user: User,
    @Body() request: ContactRequest,
  ): Promise<CommonResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);

    return {
      statusCode: 201,
      message: 'Contact created',
      data: result,
    };
  }

  @Get('/:contactId')
  @HttpCode(HttpStatus.OK)
  async get(
    @Auth() user: User,
    @Param('contactId') contactId: string,
  ): Promise<CommonResponse<ContactResponse>> {
    const result = await this.contactService.get(user, contactId);

    return {
      statusCode: 200,
      message: 'Contact created',
      data: result,
    };
  }

  @Put('/:contactId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Body() request: ContactUpdateRequest,
  ): Promise<CommonResponse<ContactResponse>> {
    const result = await this.contactService.update(user, request);

    return {
      statusCode: 200,
      message: 'Contact updated',
      data: result,
    };
  }

  @Delete('/:contactId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Auth() user: User,
    @Param('contactId') contactId: string,
  ): Promise<CommonResponse<boolean>> {
    const result = await this.contactService.delete(user, contactId);

    return {
      statusCode: 200,
      message: 'Contact deleted',
      data: true,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({optional: true})) page?: number,
    @Query('size', new ParseIntPipe({optional: true})) size?: number,
  ): Promise<CommonResponse<ContactResponse[]>> {
    const request: ContactSearchRequest = {
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 10,
    }

    return this.contactService.search(user, request);
  }
}
