import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreatePostWithAuthorDto extends CreatePostDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  bio: string;
}

export class CreateUserWithProfileDto {
  user: CreateUserDto;
  profile: CreateProfileDto;
}
