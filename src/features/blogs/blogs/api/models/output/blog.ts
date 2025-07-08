import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Represents a blog with all its properties and metadata',
})
export class BlogViewModel {
  @Field({
    description: 'Unique identifier (UUID) of the blog',
  })
  @ApiProperty({
    type: String,
    format: 'uuid',
    required: true,
    example: 'f1a2b3c4-5678-90ab-cdef-1234567890ab',
    description: 'The unique identifier for the blog in UUID format',
  })
  id: string;

  @Field({
    description: 'Timestamp when the blog was created',
  })
  @ApiProperty({
    type: String,
    required: true,
    format: 'date-time',
    example: '2024-06-08T12:34:56.789Z',
    description: 'ISO 8601 timestamp of when the blog was created',
  })
  createdAt: string;

  @Field({
    description: 'The display name of the blog (3-15 characters)',
  })
  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 15,
    required: true,
    example: 'Tech Insights',
    description: 'The name of the blog, used for display purposes',
  })
  name: string;

  @Field({
    description: 'The main website URL associated with the blog',
  })
  @ApiProperty({
    type: String,
    format: 'url',
    minLength: 1,
    maxLength: 100,
    required: true,
    pattern: '^https://.+',
    example: 'https://tech-blog.example.com',
    description: 'Valid HTTPS URL pointing to the blog website',
  })
  websiteUrl: string;

  @Field({
    description: 'Detailed description of the blog content',
  })
  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 500,
    required: true,
    description: 'Detailed description of what the blog is about',
    example: 'A blog about cutting-edge technology and software development trends',
  })
  description: string;

  @Field({
    description: 'Indicates if this is a premium membership blog',
  })
  @ApiProperty({
    type: Boolean,
    example: false,
    required: true,
    description: 'Flag indicating if this blog requires membership to access premium content',
  })
  isMembership: boolean;
}
