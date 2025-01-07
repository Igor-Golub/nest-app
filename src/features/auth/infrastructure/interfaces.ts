import type { Recovery } from '../domain/recovery.entity';
import type { Session } from '../domain/session.entity';

export type BaseDTOFromEntity<Entity> = Omit<
  Entity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type CreateRecoveryDTO = BaseDTOFromEntity<Recovery>;
export type UpdateRecoveryDTO = BaseDTOFromEntity<Recovery>;

export type CreateSessionDTO = BaseDTOFromEntity<Session>;
export type UpdateSessionDTO = BaseDTOFromEntity<Session>;
