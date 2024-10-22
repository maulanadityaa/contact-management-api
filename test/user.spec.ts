import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
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

  describe('POST /api/v1/users/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if username already exist', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/v1/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/current')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/current')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });

  describe('PATCH /api/v1/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', 'test')
        .send({
          name: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update name of current user', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', 'test')
        .send({
          name: 'test updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test updated');
    });

    it('should be able to update password of current user', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/v1/users/current')
        .set('Authorization', 'test')
        .send({
          password: 'updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');

      response = await request(app.getHttpServer())
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE /api/v1/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/users/current')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to logout user', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/users/current')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });
});
