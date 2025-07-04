import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/applyAppSettings';
import { AnswerStatus, GameStatus } from '../../src/features/quizGame/infrastructure/enums';
import { GameViewModel } from '../../src/features/quizGame/api/models/output';

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

  public async loginPlayer(httpServer: any, data: { loginOrEmail: string; password: string }) {
    const {
      body: { accessToken },
    } = await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.OK);

    return { accessToken };
  }

  public async createAndLoginPlayer(httpServer: any, data: { loginOrEmail: string; password: string }) {
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

    return { game: body };
  }

  public async createGameForTowPlayers(httpServer: any) {
    await this.generateQuestions(httpServer);

    const { accessToken: firstAccessToken } = await this.createAndLoginPlayer(httpServer, this.firstPlayerDTO);

    await this.connectPlayerToGame(httpServer, firstAccessToken);

    const { accessToken: secondAccessToken } = await this.createAndLoginPlayer(httpServer, this.secondPlayerDTO);

    const { game } = await this.connectPlayerToGame(httpServer, secondAccessToken);

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
      const { accessToken } = await manager.createAndLoginPlayer(httpServer, manager.firstPlayerDTO);
      const { game } = await manager.connectPlayerToGame(httpServer, accessToken);

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

    it.skip('should not create new game and connect second player to existing game', async () => {
      const { body } = await request(httpServer)
        .get('/sa/users')
        .auth(process.env.HTTP_BASIC_USER!, process.env.HTTP_BASIC_PASS!)
        .expect(HttpStatus.OK);

      expect(body.items.length).toBe(1);

      const { accessToken } = await manager.createAndLoginPlayer(httpServer, manager.secondPlayerDTO);
      const { game } = await manager.connectPlayerToGame(httpServer, accessToken);

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

      const { accessToken } = await manager.loginPlayer(httpServer, manager.secondPlayerDTO);

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

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.first.right);
      await manager.answer(httpServer, secondAccessToken, manager.answers.second.wrong);

      const { game: gameById } = await manager.getPairById(httpServer, game.id, firstAccessToken);

      expect(gameById.firstPlayerProgress.score).toBe(1);
      expect(gameById.firstPlayerProgress.answers.length).toBe(1);

      expect(gameById.secondPlayerProgress.score).toBe(1);
      expect(gameById.secondPlayerProgress.answers.length).toBe(2);
    });

    it.skip('should add additional score to player', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

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

    it.skip('should return in right order', async () => {
      await manager.clearDB(httpServer);

      const { firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.wrong);
      const fpGameAfter1Answer = await manager.getCurrentGame(httpServer, firstAccessToken);

      expect(fpGameAfter1Answer.questions![0].id).toEqual(fpGameAfter1Answer.firstPlayerProgress.answers[0].questionId);
      expect(fpGameAfter1Answer.firstPlayerProgress.answers[0].answerStatus).toEqual(AnswerStatus.Incorrect);
      expect(fpGameAfter1Answer.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.second.right);
      const fpGameAfter2Answer = await manager.getCurrentGame(httpServer, firstAccessToken);

      expect(fpGameAfter2Answer.questions![1].id).toEqual(fpGameAfter2Answer.firstPlayerProgress.answers[1].questionId);
      expect(fpGameAfter2Answer.firstPlayerProgress.answers[1].answerStatus).toEqual(AnswerStatus.Correct);
      expect(fpGameAfter2Answer.firstPlayerProgress.score).toEqual(1);

      await manager.answer(httpServer, secondAccessToken, manager.answers.second.wrong);
      const spGameAfter1Answer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(spGameAfter1Answer.questions![0].id).toEqual(
        spGameAfter1Answer.secondPlayerProgress!.answers[0].questionId,
      );
      expect(spGameAfter1Answer.secondPlayerProgress!.score).toEqual(1);
    });

    it.skip('players play full game and finish with a draw', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

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

    it.skip('players play full game and finish answered all wrong second 2 right', async () => {
      await manager.clearDB(httpServer);

      const { game, firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

      await manager.answer(httpServer, firstAccessToken, manager.answers.first.wrong);
      const gameAfterFirstAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterFirstAnswer.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.second.wrong);
      const gameAfterSecondAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterSecondAnswer.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.third.wrong);
      const gameAfterThirdAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterThirdAnswer.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.fourth.wrong);
      const gameAfterFourthAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterFourthAnswer.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, secondAccessToken, manager.answers.first.wrong);
      const gameAfterFifthAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterFifthAnswer.secondPlayerProgress!.score).toEqual(0);

      await manager.answer(httpServer, secondAccessToken, manager.answers.second.right);
      const gameAfterSixthAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterSixthAnswer.secondPlayerProgress!.score).toEqual(1);

      await manager.answer(httpServer, secondAccessToken, manager.answers.third.right);
      const gameAfterSeventhAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterSeventhAnswer.secondPlayerProgress!.score).toEqual(2);

      await manager.answer(httpServer, secondAccessToken, manager.answers.fourth.wrong);
      const gameAfterEighthAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterEighthAnswer.secondPlayerProgress!.score).toEqual(2);

      await manager.answer(httpServer, secondAccessToken, manager.answers.fifth.wrong);
      const gameAfterNinthAnswer = await manager.getCurrentGame(httpServer, firstAccessToken);
      expect(gameAfterNinthAnswer.firstPlayerProgress.score).toEqual(0);

      await manager.answer(httpServer, firstAccessToken, manager.answers.fifth.wrong);

      const { game: finalGame } = await manager.getPairById(httpServer, game.id, firstAccessToken);

      // 1P 0 right
      // 2P 2 right
      expect(finalGame.status).toBe(GameStatus.Finished);
      expect(finalGame.firstPlayerProgress.score).toBe(0);
      expect(finalGame.secondPlayerProgress!.score).toBe(2);
    });

    it('players play full game and finish first player should win with 5 scores', async () => {
      await manager.clearDB(httpServer);

      const { firstAccessToken, secondAccessToken } = await manager.createGameForTowPlayers(httpServer);

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
});
