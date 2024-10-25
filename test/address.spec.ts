import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { first } from 'rxjs';

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/v1/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/v1/contacts/${contact.id}/addresses`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create address', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/v1/contacts/${contact.id}/addresses`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          street: 'Jl. Test Address',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          postalCode: '12345',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('Jl. Test Address');
      expect(response.body.data.city).toBe('Jakarta');
      expect(response.body.data.province).toBe('DKI Jakarta');
      expect(response.body.data.country).toBe('Indonesia');
      expect(response.body.data.postalCode).toBe('12345');
    });
  });

  describe('GET /api/v1/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id + '1'}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id}/addresses/${address.id + '1'}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to get address', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('Jl. Test Address');
      expect(response.body.data.city).toBe('Jakarta');
      expect(response.body.data.province).toBe('DKI Jakarta');
      expect(response.body.data.country).toBe('Indonesia');
      expect(response.body.data.postalCode).toBe('12345');
    });
  });

  describe('PUT /api/v1/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: '',
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id + '1'}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: address.id,
          street: 'Jl. Test Address Updated',
          city: 'Jakarta Updated',
          province: 'DKI Jakarta Updated',
          country: 'Indonesia Updated',
          postalCode: '1234567',
        });

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id}/addresses/${address.id + '1'}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: address.id,
          street: 'Jl. Test Address Updated',
          city: 'Jakarta Updated',
          province: 'DKI Jakarta Updated',
          country: 'Indonesia Updated',
          postalCode: '1234567',
        });

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to update address', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: address.id,
          street: 'Jl. Test Address Updated',
          city: 'Jakarta Updated',
          province: 'DKI Jakarta Updated',
          country: 'Indonesia Updated',
          postalCode: '1234567',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('Jl. Test Address Updated');
      expect(response.body.data.city).toBe('Jakarta Updated');
      expect(response.body.data.province).toBe('DKI Jakarta Updated');
      expect(response.body.data.country).toBe('Indonesia Updated');
      expect(response.body.data.postalCode).toBe('1234567');
    });
  });

  describe('DELETE /api/v1/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/contacts/${contact.id + '1'}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/contacts/${contact.id}/addresses/${address.id + '1'}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to delete address', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const addressResult = await testService.getAddress();
      expect(addressResult).toBeNull();
    });
  });

  describe('GET /api/v1/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id + '1'}/addresses`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to list addresses', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id}/addresses`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].street).toBe('Jl. Test Address');
      expect(response.body.data[0].city).toBe('Jakarta');
      expect(response.body.data[0].province).toBe('DKI Jakarta');
      expect(response.body.data[0].country).toBe('Indonesia');
      expect(response.body.data[0].postalCode).toBe('12345');
    });
  });
});
