import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateUserInput, UpdateUserInput } from './dto/graphql';

@Injectable()
export class GraphqlService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserInput: CreateUserInput) {
    // convert nullable role (null) to undefined so it matches Prisma's expected type
    const data = {
      ...createUserInput,
      role: createUserInput.role ?? undefined,
    };
    return this.prismaService.user.create({
      data,
    });
  }

  update(email: string, updateUser: UpdateUserInput) {
    const { email: _email, ...rest } = updateUser;
    void _email;
    return this.prismaService.user.updateManyAndReturn({
      where: { email },
      data: rest,
      select: {
        email: true,
      },
    });
  }

  remove(email: string) {
    return this.prismaService.user.delete({
      where: { email },
    });
  }
}
