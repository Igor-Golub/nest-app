import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';

interface ConnectCommandPayload {
  gameId: string;
}

export class ConnectCommand {
  constructor(readonly payload: ConnectCommandPayload) {}
}

@CommandHandler(ConnectCommand)
export class ConnectCommandHandler implements ICommandHandler {
  constructor(private gameService: GameService) {}

  public async execute({ payload: { gameId } }: ConnectCommand) {
    return null;
  }
}
