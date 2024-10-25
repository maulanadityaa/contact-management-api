import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { first } from 'rxjs';

describe('ContactController', () => {
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

  describe('POST /api/v1/contacts', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .post('/api/v1/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: '',
          lastName: '',
          email: 'wrongEmail',
          phone: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create contact', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .post('/api/v1/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'test contact',
          lastName: 'test contact',
          email: 'valid@email.com',
          phone: '081263271251',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('test contact');
      expect(response.body.data.lastName).toBe('test contact');
      expect(response.body.data.email).toBe('valid@email.com');
      expect(response.body.data.phone).toBe('081263271251');
    });
  });

  describe('GET /api/v1/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id}` + '1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contact.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('test');
      expect(response.body.data.lastName).toBe('test');
      expect(response.body.data.email).toBe('test@email.com');
      expect(response.body.data.phone).toBe('0813644257');
    });
  });

  describe('PUT /api/v1/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id}` + '1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: contact.id + '1',
          firstName: 'test contact updated',
          lastName: 'test contact updated',
          email: 'test@mail.com',
          phone: '081263271251',
        });

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: contact.id + '1',
          firstName: '',
          lastName: '',
          email: 'wrongEmail',
          phone: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contact.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: contact.id,
          firstName: 'test contact updated',
          lastName: 'test contact updated',
          email: 'test@mail.com',
          phone: '081263271251',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('test contact updated');
      expect(response.body.data.lastName).toBe('test contact updated');
      expect(response.body.data.email).toBe('test@mail.com');
      expect(response.body.data.phone).toBe('081263271251');
    });
  });

  describe('DELETE /api/v1/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteAll()

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/contacts/${contact.id}` + '1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to delete contact', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/contacts/${contact.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });

  describe('GET /api/v1/contacts', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be able to search contacts', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by name', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          name: 'es',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by name not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          name: 'wrong',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by email', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          email: 'es',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by email not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          email: 'wrong',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by phone', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          phone: '08',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by phone not found', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          phone: '9999',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts with page', async () => {
      const token = await testService.getToken();
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          size: 1,
          page: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.currentPage).toBe(2);
      expect(response.body.paging.totalPage).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });
});
