import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddressGetRequest,
  AddressRequest,
  AddressResponse,
  AddressUpdateRequest,
} from '../model/address.model';
import { Address, User } from '@prisma/client';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(user: User, request: AddressRequest): Promise<AddressResponse> {
    this.logger.debug(
      `Creating address for user ${user.username} and data ${JSON.stringify(request)}`,
    );

    const createRequest: AddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    const contact = await this.contactService.checkContactMustExist(
      user.username,
      createRequest.contactId,
    );

    const address = await this.prismaService.address.create({
      data: {
        street: createRequest.street,
        city: createRequest.city,
        province: createRequest.province,
        country: createRequest.country,
        postal_code: createRequest.postalCode,
        ...{ contact_id: createRequest.contactId },
      },
    });

    return this.toAddressResponse(address);
  }

  async checkAddressMustExist(
    contactId: string,
    addressId: string,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return address;
  }

  async get(user: User, request: AddressGetRequest): Promise<AddressResponse> {
    this.logger.debug(
      `Getting address ${request.addressId} for contact ${request.contactId}`,
    );

    const getRequest: AddressGetRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      getRequest.contactId,
    );

    const address = await this.checkAddressMustExist(
      getRequest.contactId,
      getRequest.addressId,
    );

    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: AddressUpdateRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `Updating address ${request.id} for user ${user.username} and data ${JSON.stringify(request)}`,
    );

    const updateRequest: AddressUpdateRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      updateRequest.contactId,
    );

    let address = await this.checkAddressMustExist(
      updateRequest.contactId,
      updateRequest.id,
    );

    address = await this.prismaService.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contactId,
      },
      data: {
        street: updateRequest.street,
        city: updateRequest.city,
        province: updateRequest.province,
        country: updateRequest.country,
        postal_code: updateRequest.postalCode,
      },
    });

    return this.toAddressResponse(address);
  }

  async delete(
    user: User,
    request: AddressGetRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `Deleting address ${request.addressId} for contact ${request.contactId}`,
    );

    const deleteRequest: AddressGetRequest = this.validationService.validate(
      AddressValidation.DELETE,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      deleteRequest.contactId,
    );

    const address = await this.checkAddressMustExist(
      deleteRequest.contactId,
      deleteRequest.addressId,
    );

    await this.prismaService.address.delete({
      where: {
        id: request.addressId,
        contact_id: request.contactId,
      },
    });

    return this.toAddressResponse(address);
  }

  async list(user: User, contactId: string): Promise<AddressResponse[]> {
    this.logger.debug(`Listing addresses for contact ${contactId}`);

    await this.contactService.checkContactMustExist(user.username, contactId);

    const addresses = await this.prismaService.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((address) => this.toAddressResponse(address));
  }

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postalCode: address.postal_code,
    };
  }
}
