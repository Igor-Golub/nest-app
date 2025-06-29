import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/applyAppSettings';
import { GameStatus } from '../../src/features/quizGame/infrastructure/enums';

describe('e2e quiz game', () => {
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

  describe('current game endpoint', () => {
    it('should receive 403 if not provided auth', async () => {
      await request(httpServer).get('/pair-game-quiz/pairs/my-current').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('connection endpoint', () => {
    it('should receive 403 if not provided auth', async () => {
      await request(httpServer).post('/pair-game-quiz/pairs/connection').expect(HttpStatus.UNAUTHORIZED);
    });

    let gameId = null;

    it('should create game and connect first player', async () => {
      await request(httpServer).delete('/testing/all-data').expect(HttpStatus.NO_CONTENT);

      const { body } = await request(httpServer)
        .get('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .expect(HttpStatus.OK);

      expect(body.items.length).toBe(0);

      await request(httpServer)
        .post('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .send({ login: 'First', password: 'firstPlayer', email: 'firstPlayer@gmail.com' })
        .expect(HttpStatus.CREATED);

      const {
        body: { accessToken },
      } = await request(httpServer)
        .post('/auth/login')
        .send({ loginOrEmail: 'First', password: 'firstPlayer' })
        .expect(HttpStatus.OK);

      const { body: game } = await request(httpServer)
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      gameId = game.id;

      expect(game).not.toBeNull();
      expect(game.questions).toBeNull();
      expect(game.startGameDate).toBeNull();
      expect(game.finishGameDate).toBeNull();
      expect(game.secondPlayerProgress).toBeNull();

      expect(game.pairCreatedDate).not.toBeNull();
      expect(game.status).toBe(GameStatus.Pending);
      expect(game.firstPlayerProgress).not.toBeNull();
    });

    it('should not create new game and connect second player to existing game', async () => {
      const { body } = await request(httpServer)
        .get('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .expect(HttpStatus.OK);

      expect(body.items.length).toBe(1);

      await request(httpServer)
        .post('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .send({ login: 'Second', password: 'secondPlayer', email: 'secondPlayer@gmail.com' })
        .expect(HttpStatus.CREATED);

      const {
        body: { accessToken },
      } = await request(httpServer)
        .post('/auth/login')
        .send({ loginOrEmail: 'Second', password: 'secondPlayer' })
        .expect(HttpStatus.OK);

      const { body: game } = await request(httpServer)
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(game).not.toBeNull();
      expect(game.id).toEqual(gameId);

      expect(game.questions).not.toBeNull();
      expect(game.startGameDate).not.toBeNull();
      expect(game.pairCreatedDate).not.toBeNull();
      expect(game.status).toBe(GameStatus.Active);
      expect(game.firstPlayerProgress).not.toBeNull();
      expect(game.secondPlayerProgress).not.toBeNull();

      expect(game.finishGameDate).toBeNull();
    });
  });
});
