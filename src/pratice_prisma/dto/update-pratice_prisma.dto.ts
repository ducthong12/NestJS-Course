import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-pratice_prisma.dto';
import { Prisma } from '@generated/prisma';

export class UpdatePraticePrismaDto extends PartialType(CreateUserDto) {}

export class UpdatePraticePrismaInput {
  where: Prisma.UserWhereInput;
  data: UpdatePraticePrismaDto;
}
