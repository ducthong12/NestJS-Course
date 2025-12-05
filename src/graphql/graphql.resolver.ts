import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { PraticePrismaService } from 'src/pratice_prisma/pratice_prisma.service';
import {
  CreateUserInput,
  UpdateUserInput,
  UserOutput,
  UserWithPosts,
} from './dto/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/common/pubsub.module';

const EVENT_USER_ADDED = 'userAdded';

@Resolver(() => UserWithPosts)
export class GraphqlResolver {
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly praticePrismaService: PraticePrismaService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => [UserOutput], { name: 'findAllUser', nullable: true })
  findAll() {
    return this.praticePrismaService.findAll();
  }

  @Query(() => [UserWithPosts], { nullable: true })
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
    void this.pubSub.publish(EVENT_USER_ADDED, {
      userAdded: createUserInput,
    });
    return this.graphqlService.create(createUserInput);
  }

  @Subscription(() => UserOutput)
  userAdded() {
    // Logic to handle userAdded subscription
    return this.pubSub.asyncIterator(EVENT_USER_ADDED);
  }

  @ResolveField('countUser', () => Number)
  getCountUser(@Parent() findUserWithLeastPost: UserWithPosts) {
    console.log('Parent:', findUserWithLeastPost);
    return this.praticePrismaService.getCountByUser();
  }
}
