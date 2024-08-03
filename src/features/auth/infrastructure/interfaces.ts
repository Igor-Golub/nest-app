import type {
  SessionEntity,
  RecoveryEntity,
  SessionDBEntity,
  RecoveryDBEntity,
} from '../domain';

export interface SessionCommandRepo {
  create: (data: SessionEntity) => Promise<string>;
  delete: (id: string) => Promise<boolean>;
  dropTable: () => Promise<void>;
}

export interface RecoveryCommandRepo {
  create: (data: RecoveryEntity) => Promise<string>;
  delete: (id: string) => Promise<boolean>;
  dropTable: () => Promise<void>;
}
