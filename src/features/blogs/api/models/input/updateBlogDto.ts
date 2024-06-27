import { IsString, Length, Matches, IsUrl } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @Length(1, 15)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsString()
  @Length(1, 100)
  @IsUrl()
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  websiteUrl: string;
}
