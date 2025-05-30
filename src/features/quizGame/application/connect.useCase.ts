import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';
import { Game } from '../domain';

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
    const availableGames = await this.gameService.findAvailableGames(2);

    if (availableGames.length) return this.connectToFirstAvailableGame(availableGames, userId);
    else return this.createGameAndConnect(userId);
  }

  private async connectToFirstAvailableGame(games: Game[], userId: string) {
    const [firstGame] = games;
    await this.gameService.attachUserToGame(firstGame.id, userId);

    return firstGame.id;
  }

  private async createGameAndConnect(userId: string) {
    const { id } = await this.gameService.createGame();
    await this.gameService.attachUserToGame(id, userId);

    return id;
  }
}
