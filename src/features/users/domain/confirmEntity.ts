export enum ConfirmationStatuses {
  Created = 1,
  Failed = 2,
  Success = 3,
}

export enum ConfirmationTypes {
  Email = 1,
}

export class ConfirmEntity {
  code: string;
  ownerId: string;
  expirationAt: string;
  type: ConfirmationTypes;
  status: ConfirmationStatuses;
}

export type ConfirmDBEntity = ConfirmEntity & {
  id: string;
  updatedAt: Date;
  createdAt: Date;
};
