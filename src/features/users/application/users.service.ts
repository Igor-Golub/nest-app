import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { add, formatISO, isAfter } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  ConfirmationRepository,
  UsersQueryRepository,
  UsersRepository,
} from '../infrastructure';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import {
  ConfirmationStatuses,
  ConfirmationTypes,
} from '../domain/confirm.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepository,
    private cryptoService: CryptoService,
    private usersQueryRepo: UsersQueryRepository,
    private confirmationRepo: ConfirmationRepository,
  ) {}

  public async isUserExist(
    id: string,
    exception: 'notFound' | 'unauthorized' = 'notFound',
  ) {
    const user = await this.usersQueryRepo.findById(id);

    // TODO add interlayer
    const exceptions = {
      notFound: NotFoundException,
      unauthorized: UnauthorizedException,
    };

    if (!user) throw new exceptions[exception]();

    return user;
  }

  public async create(data: {
    login: string;
    email: string;
    password: string;
    isConfirmed: boolean;
  }) {
    const { email, isConfirmed, password, login } = data;

    const { hash } = await this.cryptoService.createSaltAndHash(password);

    const { id } = await this.usersRepo.create({
      hash,
      login,
      email,
      isConfirmed,
    });

    if (!isConfirmed) {
      const confirmationCode = uuidv4();

      await this.confirmationRepo.create({
        ownerId: id,
        code: confirmationCode,
        type: ConfirmationTypes.Email,
        status: ConfirmationStatuses.Created,
        expirationAt: formatISO(
          add(new Date(), {
            minutes: 10,
          }),
          {
            representation: 'complete',
          },
        ),
      });

      return { userId: id, confirmationCode };
    }

    return { userId: id };
  }

  public async findByEmail(email: string) {
    return this.usersRepo.findByFields({ email });
  }

  public async updateHash(id: string, hash: string) {
    return this.usersRepo.updateField(id, 'hash', hash);
  }

  public async findByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepo.findByFields({
      login: loginOrEmail,
      email: loginOrEmail,
    });
  }

  public async confirmUser(code: string) {
    const confirmation = await this.confirmationRepo.findByCode(code);

    if (!confirmation) {
      throw new BadRequestException([
        { message: 'User not found', field: 'code' },
      ]);
    }

    if (confirmation.status === ConfirmationStatuses.Success) {
      throw new BadRequestException([
        { message: 'User already confirmed', field: 'code' },
      ]);
    }

    if (isAfter(new Date(), confirmation.expirationAt)) {
      throw new BadRequestException([
        { message: 'Confirmation code expired', field: 'code' },
      ]);
    }

    await this.usersRepo.confirmUser(confirmation.ownerId);

    await this.confirmationRepo.updateConfirmationStatus(
      confirmation.id,
      ConfirmationStatuses.Success,
    );

    return true;
  }

  public async updateConfirmationCode(id: string) {
    const confirmation = await this.confirmationRepo.findByOwnerId(id);

    if (!confirmation) throw new BadRequestException();

    if (confirmation.status === ConfirmationStatuses.Success) {
      throw new BadRequestException([
        { message: 'User already confirmed', field: 'email' },
      ]);
    }

    const confirmationCode = `${uuidv4()}_${id}`;

    await this.confirmationRepo.updateConfirmationCode(
      confirmation.id,
      confirmationCode,
    );

    return { newCode: confirmationCode };
  }
}
