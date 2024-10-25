import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  ContactRequest,
  ContactResponse,
  ContactSearchRequest,
  ContactUpdateRequest,
} from '../model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';
import { v4 as uuid } from 'uuid';
import { CommonResponse } from '../model/web.model';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(user: User, request: ContactRequest): Promise<ContactResponse> {
    this.logger.debug(
      `Creating contact for user ${user.username} and data ${JSON.stringify(request)}`,
    );

    const createRequest: ContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        first_name: createRequest.firstName,
        last_name: createRequest.lastName,
        email: createRequest.email,
        phone: createRequest.phone,
        ...{ username: user.username },
      },
    });

    return this.toContactResponse(contact);
  }

  async checkContactMustExist(
    username: string,
    contactId: string,
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', 404);
    }

    return contact;
  }

  async get(user: User, contactId: string): Promise<ContactResponse> {
    this.logger.debug(`Getting contact ${contactId} for user ${user.username}`);

    const contact = await this.checkContactMustExist(user.username, contactId);

    return this.toContactResponse(contact);
  }

  async update(
    user: User,
    request: ContactUpdateRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `Updating contact for user ${user.username} and data ${JSON.stringify(request)}`,
    );

    const updateRequest: ContactUpdateRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );

    let contact = await this.checkContactMustExist(
      user.username,
      updateRequest.id,
    );

    contact = await this.prismaService.contact.update({
      where: {
        id: updateRequest.id,
      },
      data: {
        first_name: updateRequest.firstName,
        last_name: updateRequest.lastName,
        email: updateRequest.email,
        phone: updateRequest.phone,
      },
    });

    return this.toContactResponse(contact);
  }

  async delete(user: User, contactId: string): Promise<ContactResponse> {
    this.logger.debug(
      `Deleting contact ${contactId} for user ${user.username}`,
    );

    let contact = await this.checkContactMustExist(user.username, contactId);

    contact = await this.prismaService.contact.delete({
      where: {
        id: contactId,
      },
    });

    return this.toContactResponse(contact);
  }

  async search(
    user: User,
    request: ContactSearchRequest,
  ): Promise<CommonResponse<ContactResponse[]>> {
    const contactSearchRequest: ContactSearchRequest =
      this.validationService.validate(ContactValidation.SEARCH, request);

    const filters = [];

    if (contactSearchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: contactSearchRequest.name,
              mode: 'insensitive',
            },
          },
          {
            last_name: {
              contains: contactSearchRequest.name,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (contactSearchRequest.email) {
      filters.push({
        email: {
          contains: contactSearchRequest.email,
          mode: 'insensitive',
        },
      });
    }

    if (contactSearchRequest.phone) {
      filters.push({
        phone: {
          contains: contactSearchRequest.phone,
          mode: 'insensitive',
        },
      });
    }

    const skip = (contactSearchRequest.page - 1) * contactSearchRequest.size;

    const contacts = await this.prismaService.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: contactSearchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      statusCode: 200,
      message: 'Contact found',
      data: contacts.map((contact) => this.toContactResponse(contact)),
      paging: {
        currentPage: contactSearchRequest.page,
        totalPage: Math.ceil(total / contactSearchRequest.size),
        size: contactSearchRequest.size,
      },
    };
  }

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    };
  }
}
