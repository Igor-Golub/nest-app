import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { applyAppSettings } from '@app/settings/applyAppSettings';

describe('e2e users feature', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);

    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Should create user', () => {
    it('user should created', function () {
      request(httpServer).post('/users').expect(HttpStatus.CREATED);
    });
  });
});
