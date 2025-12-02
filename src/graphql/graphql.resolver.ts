import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { CreateUserInputGraphQl } from './dto/create-user-graphql.input';
import { UpdateUserInputGraphQl } from './dto/update-user-graphql.input';
import { PraticePrismaService } from 'src/pratice_prisma/pratice_prisma.service';
import { UserOutputGraphQlDto } from './dto/user-graphql.output';

@Resolver('graphql')
export class GraphqlResolver {
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly praticePrismaService: PraticePrismaService,
  ) {}

  @Mutation(() => Boolean, { name: 'createUser' })
  create(@Args('createUserInput') createUserInput: CreateUserInputGraphQl) {
    return this.graphqlService.create(createUserInput);
  }

  @Query(() => String, { name: 'findAllUser' })
  findAll() {
    return this.graphqlService.findAll();
  }

  @Query(() => UserOutputGraphQlDto, { name: 'findEmailWithPost' })
  findEmailWithPost(@Args('email') email: string) {
    return this.praticePrismaService.findEmailWithPost({ email });
  }

  @Mutation(() => Boolean, { name: 'updateUser' })
  update(@Args('updateUserInput') updateUserInput: UpdateUserInputGraphQl) {
    return this.graphqlService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  remove(@Args('id') id: number) {
    return this.graphqlService.remove(id);
  }
}
