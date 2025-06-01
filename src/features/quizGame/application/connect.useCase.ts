import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';

interface ConnectCommandPayload {
  userId: string;
}

export class ConnectCommand {
  constructor(readonly payload: ConnectCommandPayload) {}
}

@CommandHandler(ConnectCommand)
export class ConnectCommandHandler implements ICommandHandler<ConnectCommand> {
  constructor(private gameService: GameService) {}

  public async execute({ payload: { userId } }: ConnectCommand) {
    await this.gameService.checkIsUserAlreadyInGame(userId);

    const availableGame = await this.gameService.findAvailableGames();

    if (availableGame) return this.connectToGame(availableGame.id, userId);
    else return this.createGameAndConnect(userId);
  }

  private async connectToGame(gameId: string, userId: string) {
    await this.gameService.connectUser(gameId, userId);

    return gameId;
  }

  private async createGameAndConnect(userId: string) {
    const { id: gameId } = await this.gameService.createGame(userId);
    await this.connectToGame(gameId, userId);

    return gameId;
  }
}
