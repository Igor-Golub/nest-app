export declare global {
  namespace DBModels {
    type MongoResponseEntity<Entity> = WithId<Entity>;

    interface Blog {
      name: string;
      description: string;
      websiteUrl: string;
      isMembership: boolean;
    }
  }
}
