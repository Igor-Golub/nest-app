import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/applyAppSettings';
import { GameStatus } from '../../src/features/quizGame/infrastructure/enums';

class Manager {
  public questions = [
    { body: 'Body of 1 question', correctAnswers: ['1'] },
    { body: 'Body of 2 question', correctAnswers: ['2'] },
    { body: 'Body of 3 question', correctAnswers: ['3'] },
    { body: 'Body of 4 question', correctAnswers: ['4'] },
    { body: 'Body of 5 question', correctAnswers: ['5'] },
  ];

  public async clearDB(httpServer: any) {
    await request(httpServer).delete('/testing/all-data').expect(HttpStatus.NO_CONTENT);
  }

  public async generateQuestions(httpServer: any) {
    const res = await Promise.all(
      this.questions.map((question) =>
        request(httpServer)
          .post('/sa/quiz/questions')
          .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
          .send(question)
          .expect(HttpStatus.CREATED),
      ),
    );

    await Promise.all(
      res.map(({ body }) =>
        request(httpServer)
          .put(`/sa/quiz/questions/${body.id}/publish`)
          .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
          .send({ published: true })
          .expect(HttpStatus.NO_CONTENT),
      ),
    );
  }

  public async createGameForTowPlayers(httpServer: any) {
    await this.generateQuestions(httpServer);

    await request(httpServer)
      .post('/sa/users')
      .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
      .send({ login: 'First', password: 'firstPlayer', email: 'firstPlayer@gmail.com' })
      .expect(HttpStatus.CREATED);

    const {
      body: { accessToken: firstAccessToken },
    } = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: 'First', password: 'firstPlayer' })
      .expect(HttpStatus.OK);

    await request(httpServer)
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .expect(HttpStatus.OK);

    await request(httpServer)
      .post('/sa/users')
      .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
      .send({ login: 'Second', password: 'secondPlayer', email: 'secondPlayer@gmail.com' })
      .expect(HttpStatus.CREATED);

    const {
      body: { accessToken: secondAccessToken },
    } = await request(httpServer)
      .post('/auth/login')
      .send({ loginOrEmail: 'Second', password: 'secondPlayer' })
      .expect(HttpStatus.OK);

    const { body: game } = await request(httpServer)
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .expect(HttpStatus.OK);

    expect(game.questions.length).toBe(5);

    const firstPlayer = game.firstPlayerProgress;
    const secondPlayer = game.secondPlayerProgress;

    expect(firstPlayer.player.login).toBe('First');
    expect(secondPlayer.player.login).toBe('Second');

    return { game, firstAccessToken, secondAccessToken };
  }

  public async answer(httpServer: any, token: string, answer: string) {
    await request(httpServer)
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${token}`)
      .send({ answer })
      .expect(HttpStatus.OK);
  }

  public async getCurrentGame(httpServer: any, token: string) {
    return request(httpServer)
      .get(`/pair-game-quiz/pairs/my-current`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  }
}

const manager = new Manager();

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
    it.skip('should receive 403 if not provided auth', async () => {
      await request(httpServer).post('/pair-game-quiz/pairs/connection').expect(HttpStatus.UNAUTHORIZED);
    });

    let gameId = null;

    it.skip('should create game and connect first player', async () => {
      await manager.clearDB(httpServer);

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

    it.skip('should not create new game and connect second player to existing game', async () => {
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

    it.skip('should return 403 if user already in game', async () => {
      const { body } = await request(httpServer)
        .get('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .expect(HttpStatus.OK);

      expect(body.items.length).toBe(2);

      const {
        body: { accessToken },
      } = await request(httpServer)
        .post('/auth/login')
        .send({ loginOrEmail: 'Second', password: 'secondPlayer' })
        .expect(HttpStatus.OK);

      await request(httpServer)
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('answers endpoint', () => {
    it.skip('should receive 403 if not provided auth', async () => {
      await request(httpServer).post('/pair-game-quiz/pairs/my-current/answers').expect(HttpStatus.UNAUTHORIZED);
    });

    it.skip('should create game and connect two players make answers', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

      await manager.answer(httpServer, firstAccessToken, '1');
      await manager.answer(httpServer, secondAccessToken, '1');
      await manager.answer(httpServer, secondAccessToken, '0');

      const { body: gameById } = await request(httpServer)
        .get(`/pair-game-quiz/pairs/${game.id}`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .expect(HttpStatus.OK);

      expect(gameById.firstPlayerProgress.score).toBe(1);
      expect(gameById.firstPlayerProgress.answers.length).toBe(1);

      expect(gameById.secondPlayerProgress.score).toBe(1);
      expect(gameById.secondPlayerProgress.answers.length).toBe(2);
    });

    it.skip('should add additional score to player', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

      await manager.answer(httpServer, firstAccessToken, '1');

      await manager.answer(httpServer, secondAccessToken, '1');
      await manager.answer(httpServer, secondAccessToken, '2');
      await manager.answer(httpServer, secondAccessToken, '3');
      await manager.answer(httpServer, secondAccessToken, '4');
      await manager.answer(httpServer, secondAccessToken, '5');

      const { body: gameAfterSecondUserAnswers } = await request(httpServer)
        .get(`/pair-game-quiz/pairs/${game.id}`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .expect(HttpStatus.OK);

      expect(gameAfterSecondUserAnswers.firstPlayerProgress.score).toBe(1);
      expect(gameAfterSecondUserAnswers.firstPlayerProgress.answers.length).toBe(1);

      expect(gameAfterSecondUserAnswers.secondPlayerProgress.score).toBe(6);
      expect(gameAfterSecondUserAnswers.secondPlayerProgress.answers.length).toBe(5);

      expect(gameAfterSecondUserAnswers.status).toBe(GameStatus.Active);

      await manager.answer(httpServer, firstAccessToken, '2');
      await manager.answer(httpServer, firstAccessToken, '3');
      await manager.answer(httpServer, firstAccessToken, '4');
      await manager.answer(httpServer, firstAccessToken, '5');

      const { body: gameAfterFirstUserAnswers } = await request(httpServer)
        .get(`/pair-game-quiz/pairs/${game.id}`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .expect(HttpStatus.OK);

      expect(gameAfterFirstUserAnswers.firstPlayerProgress.score).toBe(5);
      expect(gameAfterFirstUserAnswers.firstPlayerProgress.answers.length).toBe(5);

      expect(gameAfterFirstUserAnswers.status).toBe(GameStatus.Finished);
    });

    it('failed', async () => {
      await manager.clearDB(httpServer);

      const { firstAccessToken } = await manager.createGameForTowPlayers(httpServer);

      await manager.answer(httpServer, firstAccessToken, '1');
      const { body: game } = await manager.getCurrentGame(httpServer, firstAccessToken);

      console.log(game.questions);
      console.log(game.firstPlayerProgress.answers[0]);

      expect(game.questions[0].id).toEqual(game.firstPlayerProgress.answers[0].questionId);
    });
  });
});
