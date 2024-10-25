import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CommonResponse } from '../model/web.model';
import {
  AddressGetRequest,
  AddressRequest,
  AddressResponse,
  AddressUpdateRequest,
} from '../model/address.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Addresses')
@Controller('/api/v1/contacts/:contactId/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Address created' })
  async create(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Body() request: AddressRequest,
  ): Promise<CommonResponse<AddressResponse>> {
    request.contactId = contactId;
    const result = await this.addressService.create(user, request);

    return {
      statusCode: 201,
      message: 'Address created',
      data: result,
    };
  }

  @Get('/:addressId')
  @ApiOperation({ summary: 'Get an address' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Address retrieved' })
  @HttpCode(HttpStatus.OK)
  async get(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Param('addressId') addressId: string,
  ): Promise<CommonResponse<AddressResponse>> {
    const request: AddressGetRequest = {
      contactId: contactId,
      addressId: addressId,
    };
    const result = await this.addressService.get(user, request);

    return {
      statusCode: 200,
      message: 'Address retrieved',
      data: result,
    };
  }

  @Put('/:addressId')
  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Address updated' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Param('addressId') addressId: string,
    @Body() request: AddressUpdateRequest,
  ): Promise<CommonResponse<AddressResponse>> {
    request.contactId = contactId;
    request.id = addressId;
    const result = await this.addressService.update(user, request);

    return {
      statusCode: 200,
      message: 'Address updated',
      data: result,
    };
  }

  @Delete('/:addressId')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Address deleted' })
  @HttpCode(HttpStatus.OK)
  async delete(
    @Auth() user: User,
    @Param('contactId') contactId: string,
    @Param('addressId') addressId: string,
  ): Promise<CommonResponse<boolean>> {
    const request: AddressGetRequest = {
      contactId: contactId,
      addressId: addressId,
    };
    await this.addressService.delete(user, request);

    return {
      statusCode: 200,
      message: 'Address deleted',
      data: true,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all addresses' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Addresses retrieved' })
  @HttpCode(HttpStatus.OK)
  async list(
    @Auth() user: User,
    @Param('contactId') contactId: string,
  ): Promise<CommonResponse<AddressResponse[]>> {
    const result = await this.addressService.list(user, contactId);

    return {
      statusCode: 200,
      message: 'Addresses retrieved',
      data: result,
    };
  }
}
