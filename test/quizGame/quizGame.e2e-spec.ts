import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/applyAppSettings';
import { AnswerStatus, GameStatus } from '../../src/features/quizGame/infrastructure/enums';
import { GameViewModel } from '../../src/features/quizGame/api/models/output';

interface ICreatePlayer {
  password: string;
  loginOrEmail: string;
}

class Manager {
  public firstPlayerDTO = {
    loginOrEmail: 'First',
    password: 'firstPlayer',
  };

  public secondPlayerDTO = {
    loginOrEmail: 'Second',
    password: 'secondPlayer',
  };

  public answers = {
    first: { right: 'one', wrong: 'w' },
    second: { right: 'two', wrong: 'w' },
    third: { right: 'tree', wrong: 'w' },
    fourth: { right: 'four', wrong: 'w' },
    fifth: { right: 'five', wrong: 'w' },
  };

  public questions = [
    { body: 'Body of 1 question', correctAnswers: [this.answers.first.right] },
    { body: 'Body of 2 question', correctAnswers: [this.answers.second.right] },
    { body: 'Body of 3 question', correctAnswers: [this.answers.third.right] },
    { body: 'Body of 4 question', correctAnswers: [this.answers.fourth.right] },
    { body: 'Body of 5 question', correctAnswers: [this.answers.fifth.right] },
  ];

  public async clearDB(httpServer: any) {
    await request(httpServer).delete('/testing/all-data').expect(HttpStatus.NO_CONTENT);
  }

  public async createQuestion(httpServer: any, question: { body: string; correctAnswers: string[] }) {
    return request(httpServer)
      .post('/sa/quiz/questions')
      .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
      .send(question)
      .expect(HttpStatus.CREATED);
  }

  public async publishQuestion(httpServer: any, questionId: string) {
    return request(httpServer)
      .put(`/sa/quiz/questions/${questionId}/publish`)
      .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
      .send({ published: true })
      .expect(HttpStatus.NO_CONTENT);
  }

  public async generateQuestions(httpServer: any) {
    const [first, second, third, fourth, fifth] = this.questions;

    const { body: firstQuestion } = await this.createQuestion(httpServer, first);
    await this.publishQuestion(httpServer, firstQuestion.id);

    const { body: secondQuestion } = await this.createQuestion(httpServer, second);
    await this.publishQuestion(httpServer, secondQuestion.id);

    const { body: thirdQuestion } = await this.createQuestion(httpServer, third);
    await this.publishQuestion(httpServer, thirdQuestion.id);

    const { body: fourthQuestion } = await this.createQuestion(httpServer, fourth);
    await this.publishQuestion(httpServer, fourthQuestion.id);

    const { body: fifthQuestion } = await this.createQuestion(httpServer, fifth);
    await this.publishQuestion(httpServer, fifthQuestion.id);
  }

  public async loginPlayer(httpServer: any, data: ICreatePlayer) {
    const {
      body: { accessToken },
    } = await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.OK);

    return { accessToken };
  }

  public async createAndLoginPlayer(httpServer: any, data: ICreatePlayer) {
    await request(httpServer)
      .post('/sa/users')
      .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
      .send({ login: data.loginOrEmail, password: data.password, email: `${data.loginOrEmail}@gmail.com` })
      .expect(HttpStatus.CREATED);

    return await this.loginPlayer(httpServer, data);
  }

  public async connectPlayerToGame(httpServer: any, token: string) {
    const { body } = await request(httpServer)
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    return body;
  }

  public async createGameForTowPlayers(httpServer: any, players: { first: ICreatePlayer; second: ICreatePlayer }) {
    await this.generateQuestions(httpServer);

    const { accessToken: firstAccessToken } = await this.createAndLoginPlayer(httpServer, players.first);

    await this.connectPlayerToGame(httpServer, firstAccessToken);

    const { accessToken: secondAccessToken } = await this.createAndLoginPlayer(httpServer, players.second);

    const game = await this.connectPlayerToGame(httpServer, secondAccessToken);

    expect(game.questions.length).toBe(5);

    const firstPlayer = game.firstPlayerProgress;
    const secondPlayer = game.secondPlayerProgress;

    expect(firstPlayer.player.login).toBe(this.firstPlayerDTO.loginOrEmail);
    expect(secondPlayer.player.login).toBe(this.secondPlayerDTO.loginOrEmail);

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
    const { body } = await request(httpServer)
      .get(`/pair-game-quiz/pairs/my-current`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    return body as GameViewModel;
  }

  public async getPairById(httpServer: any, id: string, token: string) {
    const { body: game } = await request(httpServer)
      .get(`/pair-game-quiz/pairs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    return game;
  }

  public async getUserStatistic(httpServer: any, token: string) {
    const { body: game } = await request(httpServer)
      .get(`/pair-game-quiz/users/my-statistic`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    return game;
  }

  public async getUserHistory(httpServer: any, token: string) {
    const { body: game } = await request(httpServer)
      .get(`/pair-game-quiz/pairs/my`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    return game;
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

  describe.skip('current game endpoint', () => {
    it('should receive 403 if not provided auth', async () => {
      await request(httpServer).get('/pair-game-quiz/pairs/my-current').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe.skip('connection endpoint', () => {
    it('should receive 403 if not provided auth', async () => {
      await request(httpServer).post('/pair-game-quiz/pairs/connection').expect(HttpStatus.UNAUTHORIZED);
    });

    let gameId = null;

    it('should create game and connect first player', async () => {
      await manager.clearDB(httpServer);
      const { accessToken } = await manager.createAndLoginPlayer(httpServer, manager.firstPlayerDTO);
      const game = await manager.connectPlayerToGame(httpServer, accessToken);

      expect(game).not.toBeNull();
      expect(game.questions).toBeNull();
      expect(game.startGameDate).toBeNull();
      expect(game.finishGameDate).toBeNull();
      expect(game.secondPlayerProgress).toBeNull();

      expect(game.pairCreatedDate).not.toBeNull();
      expect(game.status).toBe(GameStatus.Pending);
      expect(game.firstPlayerProgress).not.toBeNull();

      gameId = game.id;
    });

    it('should not create new game and connect second player to existing game', async () => {
      const { body } = await request(httpServer)
        .get('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .expect(HttpStatus.OK);

      expect(body.items.length).toBe(1);

      const { accessToken } = await manager.createAndLoginPlayer(httpServer, manager.secondPlayerDTO);
      const game = await manager.connectPlayerToGame(httpServer, accessToken);

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

    it('should return 403 if user already in game', async () => {
      const { body } = await request(httpServer)
        .get('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .expect(HttpStatus.OK);

      expect(body.items.length).toBe(2);

      const { accessToken } = await manager.loginPlayer(httpServer, manager.secondPlayerDTO);

      await request(httpServer)
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe.skip('answers endpoint', () => {
    it('should receive 403 if not provided auth', async () => {
      await request(httpServer).post('/pair-game-quiz/pairs/my-current/answers').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should create game and connect two players make answers', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.wrong);

      const { game: gameById } = await manager.getPairById(httpServer, game.id, firstAccessToken);

      expect(gameById.firstPlayerProgress.score).toBe(1);
      expect(gameById.firstPlayerProgress.answers.length).toBe(1);

      expect(gameById.secondPlayerProgress.score).toBe(1);
      expect(gameById.secondPlayerProgress.answers.length).toBe(2);
    });

    it('should add additional score to player', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);

      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.third.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fifth.right);

      const { game: gameAfterSecondUserAnswers } = await manager.getPairById(httpServer, game.id, firstAccessToken);

      expect(gameAfterSecondUserAnswers.firstPlayerProgress.score).toBe(1);
      expect(gameAfterSecondUserAnswers.firstPlayerProgress.answers.length).toBe(1);

      expect(gameAfterSecondUserAnswers.secondPlayerProgress.score).toBe(6);
      expect(gameAfterSecondUserAnswers.secondPlayerProgress.answers.length).toBe(5);

      expect(gameAfterSecondUserAnswers.status).toBe(GameStatus.Active);

      await manager.answer(httpServer, firstAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.third.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fifth.right);

      const { game: gameAfterFirstUserAnswers } = await manager.getPairById(httpServer, game.id, firstAccessToken);

      expect(gameAfterFirstUserAnswers.firstPlayerProgress.score).toBe(5);
      expect(gameAfterFirstUserAnswers.firstPlayerProgress.answers.length).toBe(5);

      expect(gameAfterFirstUserAnswers.status).toBe(GameStatus.Finished);
    });

    it('should return in right order', async () => {
      await manager.clearDB(httpServer);

      const { firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.wrong);
      let game = await manager.getCurrentGame(httpServer, firstAccessToken);

      expect(game.questions![0].id).toEqual(game.firstPlayerProgress.answers[0].questionId);
      expect(game.firstPlayerProgress.answers[0].answerStatus).toEqual(AnswerStatus.Incorrect);
      expect(game.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.second.right);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);

      expect(game.questions![1].id).toEqual(game.firstPlayerProgress.answers[1].questionId);
      expect(game.firstPlayerProgress.answers[1].answerStatus).toEqual(AnswerStatus.Correct);
      expect(game.firstPlayerProgress.score).toEqual(1);

      await manager.answer(httpServer, secondAccessToken, manager.answers.second.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.questions![0].id).toEqual(game.secondPlayerProgress!.answers[0].questionId);
      expect(game.secondPlayerProgress!.score).toEqual(1);
    });

    it('players play full game and finish with a draw', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.second.wrong);
      await manager.answer(httpServer, firstAccessToken, manager.answers.third.wrong);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.right);

      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.third.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.right);

      await manager.answer(httpServer, firstAccessToken, manager.answers.fifth.wrong);

      await manager.answer(httpServer, secondAccessToken, manager.answers.fifth.right);

      // 1P 2 right + 1 additional
      // 2P 3 right
      const { game: finalGame } = await manager.getPairById(httpServer, game.id, firstAccessToken);

      expect(finalGame.status).toBe(GameStatus.Finished);
      expect(finalGame.firstPlayerProgress.score).toBe(3);
      expect(finalGame.secondPlayerProgress!.score).toBe(3);
    });

    it('players play full game and finish answered all wrong second 2 right', async () => {
      await manager.clearDB(httpServer);

      const { firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.wrong);
      let game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.second.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.third.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, secondAccessToken, manager.answers.first.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(0);

      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(1);

      await manager.answer(httpServer, secondAccessToken, manager.answers.third.right);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(2);

      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(2);

      await manager.answer(httpServer, secondAccessToken, manager.answers.fifth.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.fifth.wrong);

      game = await manager.getPairById(httpServer, game.id, firstAccessToken);

      // 1P 0 right
      // 2P 2 right
      expect(game.status).toBe(GameStatus.Finished);
      expect(game.firstPlayerProgress.score).toBe(0);
      expect(game.secondPlayerProgress!.score).toBe(2);
    });

    it('players play full game and finish first player should win with 5 scores', async () => {
      await manager.clearDB(httpServer);

      const { firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      //1 add correct answer by firstPlayer
      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      let game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(1);

      //2 add correct answer by firstPlayer
      await manager.answer(httpServer, firstAccessToken, manager.answers.second.right);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(2);

      //3 add correct answer by secondPlayer
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      game = await manager.getCurrentGame(httpServer, secondAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(1);

      //4 add correct answer by secondPlayer
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      game = await manager.getCurrentGame(httpServer, secondAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(2);

      //5 add incorrect answer by firstPlayer
      await manager.answer(httpServer, firstAccessToken, manager.answers.third.right);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(3);

      //6 add correct answer by firstPlayer
      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.right);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(4);

      //7 add correct answer by secondPlayer
      await manager.answer(httpServer, secondAccessToken, manager.answers.third.right);
      game = await manager.getCurrentGame(httpServer, secondAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(3);

      //8 add correct answer by firstPlayer
      await manager.answer(httpServer, firstAccessToken, manager.answers.first.wrong);
      game = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(game.firstPlayerProgress.score).toEqual(4);

      //9 add incorrect answer by secondPlayer
      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.wrong);
      game = await manager.getCurrentGame(httpServer, secondAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(3);

      //10 add incorrect answer by secondPlayer
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.wrong);
      game = await manager.getPairById(httpServer, game.id, secondAccessToken);
      expect(game.secondPlayerProgress!.score).toEqual(3);

      expect(game.status).toEqual(GameStatus.Finished);
      expect(game.firstPlayerProgress.score).toBe(5);
      expect(game.secondPlayerProgress!.score).toBe(3);
    });
  });

  describe('statistics and history', () => {
    it('should get user statistics', async () => {
      let sharedGame;

      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer, {
        first: manager.firstPlayerDTO,
        second: manager.secondPlayerDTO,
      });

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.third.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.third.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.first.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.wrong);
      sharedGame = await manager.getPairById(httpServer, game.id, secondAccessToken);

      expect(sharedGame.status).toEqual(GameStatus.Finished);
      expect(sharedGame.firstPlayerProgress.score).toBe(5);
      expect(sharedGame.secondPlayerProgress!.score).toBe(3);

      await manager.connectPlayerToGame(httpServer, firstAccessToken);
      sharedGame = await manager.connectPlayerToGame(httpServer, secondAccessToken);

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.third.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fifth.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.third.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fifth.wrong);
      sharedGame = await manager.getPairById(httpServer, sharedGame.id, secondAccessToken);

      expect(sharedGame.status).toEqual(GameStatus.Finished);
      expect(sharedGame.firstPlayerProgress.score).toBe(5);
      expect(sharedGame.secondPlayerProgress!.score).toBe(3);

      await manager.connectPlayerToGame(httpServer, firstAccessToken);
      sharedGame = await manager.connectPlayerToGame(httpServer, secondAccessToken);

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, firstAccessToken, manager.answers.second.wrong);
      await manager.answer(httpServer, firstAccessToken, manager.answers.third.wrong);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.wrong);
      await manager.answer(httpServer, firstAccessToken, manager.answers.fifth.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.third.wrong);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.fifth.wrong);
      sharedGame = await manager.getPairById(httpServer, sharedGame.id, secondAccessToken);

      expect(sharedGame.status).toEqual(GameStatus.Finished);
      expect(sharedGame.firstPlayerProgress.score).toBe(2);
      expect(sharedGame.secondPlayerProgress!.score).toBe(2);

      const firstUserStatistic = await manager.getUserStatistic(httpServer, firstAccessToken);
      expect(firstUserStatistic).toEqual({
        sumScore: 12,
        winsCount: 2,
        avgScores: 4,
        gamesCount: 3,
        drawsCount: 1,
        lossesCount: 0,
      });

      const secondUserStatistic = await manager.getUserStatistic(httpServer, secondAccessToken);
      expect(secondUserStatistic).toEqual({
        sumScore: 8,
        winsCount: 0,
        gamesCount: 3,
        drawsCount: 1,
        lossesCount: 2,
        avgScores: 2.67,
      });

      const result = await manager.getUserHistory(httpServer, firstAccessToken);

      expect(result.totalCount).toBe(3);
    });
  });
});
