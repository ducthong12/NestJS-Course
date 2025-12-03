import { Args, Query, Resolver } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { PraticePrismaService } from 'src/pratice_prisma/pratice_prisma.service';
import { UserOutput } from './dto/graphql';

@Resolver('graphql')
export class GraphqlResolver {
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly praticePrismaService: PraticePrismaService,
  ) {}

  // @Mutation(() => UserOutput)
  // createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
  //   return this.praticePrismaService.create(createUserInput);
  // }

  @Query(() => [UserOutput], { name: 'findAllUser', nullable: true })
  findAll() {
    return this.praticePrismaService.findAll();
  }

  @Query(() => [UserOutput], { nullable: true })
  findUserWithLeastPost() {
    return this.praticePrismaService.findUserWithLeastPost();
  }

  @Query(() => UserOutput, {
    nullable: true,
  })
  findEmailWithPost(@Args('email') email: string) {
    return this.praticePrismaService.findEmailWithPost({ email });
  }

  // @Mutation(() => Boolean, { name: 'updateUser' })
  // update(@Args('updateUserInput') updateUserInput: UpdateUserInputGraphQl) {
  //   return this.graphqlService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => Boolean, { name: 'removeUser' })
  // remove(@Args('id') id: number) {
  //   return this.graphqlService.remove(id);
  // }
}
