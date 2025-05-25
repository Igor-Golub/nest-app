import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/applyAppSettings';

describe('e2e admin quiz game', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
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

  describe.skip('get questions', () => {
    it('should receive user current game', async () => {
      await request(httpServer).get('/game/pairs/my-current').expect(HttpStatus.OK);
    });
  });

  describe.skip('get question', () => {
    it('should receive user current game', async () => {
      await request(httpServer).get('/game/pairs/my-current').expect(HttpStatus.OK);
    });
  });

  describe.skip('create question', () => {
    it('should return 400 if DTO incorrect', async () => {
      await request(httpServer)
        .post('/sa/quiz/questions')
        .send({ body: '1', correctAnswers: ['012345678'] })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe.skip('update question', () => {
    it('should receive user current game', async () => {
      await request(httpServer).get('/game/pairs/my-current').expect(HttpStatus.OK);
    });
  });

  describe.skip('publish question', () => {
    it('should receive user current game', async () => {
      await request(httpServer).get('/game/pairs/my-current').expect(HttpStatus.OK);
    });
  });

  describe('delete question', () => {
    it('should return 400 if id not UUID', async () => {
      const nonUUIDId = '12';

      await request(httpServer).delete(`/sa/quiz/questions/${nonUUIDId}`).expect(HttpStatus.BAD_REQUEST);
    });

    it.skip('should return 400 if question id not UUID', async () => {
      const nonExistentId = '11111111-1111-1111-1111-111111111111';

      await request(httpServer).delete(`/sa/quiz/questions/${nonExistentId}`).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
