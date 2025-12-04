import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { PraticePrismaService } from 'src/pratice_prisma/pratice_prisma.service';
import { CreateUserInput, UpdateUserInput, UserOutput } from './dto/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/common/pubsub.module';

const EVENT_USER_ADDED = 'userAdded';

@Resolver(() => UserOutput)
export class GraphqlResolver {
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly praticePrismaService: PraticePrismaService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
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

  @Mutation(() => [UserOutput], { nullable: true })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.graphqlService.update(updateUserInput.email, updateUserInput);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('email') email: string) {
    return this.graphqlService.remove(email);
  }

  @Mutation(() => UserOutput)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.pubSub.publish(EVENT_USER_ADDED, {
      userAdded: createUserInput,
    });
    return this.graphqlService.create(createUserInput);
  }

  @Subscription(() => UserOutput)
  userAdded() {
    // Logic to handle userAdded subscription
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.pubSub.asyncIterator(EVENT_USER_ADDED);
  }
}
