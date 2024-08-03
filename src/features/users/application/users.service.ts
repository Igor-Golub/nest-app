import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { add, isAfter } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationRepo, UsersQueryRepo, UsersRepo } from '../infrastructure';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { ConfirmationStates, ConfirmationTypes } from '../domain/confirmEntity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepo,
    private cryptoService: CryptoService,
    private usersQueryRepo: UsersQueryRepo,
    private confirmationRepo: ConfirmationRepo,
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

    const userId = await this.usersRepo.create({
      hash,
      login,
      email,
      isConfirmed,
    });

    if (!isConfirmed) {
      const confirmationCode = uuidv4();

      await this.confirmationRepo.create({
        ownerId: userId,
        code: confirmationCode,
        type: ConfirmationTypes.Email,
        status: ConfirmationStates.Created,
        expirationAt: add(new Date(), {
          minutes: 10,
        }),
      });

      return { userId, confirmationCode };
    }

    return { userId };
  }

  public async findByEmail(email: string) {
    return this.usersRepo.findByField('email', email);
  }

  public async updateHash(id: string, hash: string) {
    return this.usersRepo.updateField(id, 'hash', hash);
  }

  public async findByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepo.findByFields(['login', 'email'], loginOrEmail);
  }

  public async confirmUser(code: string) {
    const confirmation = await this.confirmationRepo.findByField('code', code);

    if (!confirmation) {
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    }

    if (confirmation.status === ConfirmationStates.Success) {
      throw new BadRequestException([
        {
          message: 'User already confirmed',
          field: 'code',
        },
      ]);
    }

    if (isAfter(new Date(), confirmation.expirationAt)) {
      throw new BadRequestException([
        {
          message: 'Confirmation code expired',
          field: 'code',
        },
      ]);
    }

    return await this.confirmationRepo.updateField(
      confirmation.id,
      'status',
      ConfirmationStates.Success,
    );
  }

  public async updateConfirmationCode(id: string) {
    const confirmation = await this.confirmationRepo.findByField('ownerId', id);

    if (!confirmation) throw new BadRequestException();

    if (confirmation?.status === ConfirmationStates.Success) {
      throw new BadRequestException([
        {
          message: 'User already confirmed',
          field: 'email',
        },
      ]);
    }

    const confirmationCode = `${uuidv4()}_${id}`;

    await this.confirmationRepo.updateField(
      confirmation.id,
      'code',
      confirmationCode,
    );

    return { newCode: confirmationCode };
  }

  public async dropUserTable() {
    return this.usersRepo.dropTable();
  }

  public async dropConfirmationTable() {
    return this.confirmationRepo.dropTable();
  }
}
