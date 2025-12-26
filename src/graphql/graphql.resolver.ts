import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PraticePrismaService } from 'src/pratice_prisma/pratice_prisma.service';
import { AddPostInput, EditPostInput } from './dto/graphql';
import { GraphqlService } from './graphql.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly praticePrismaService: PraticePrismaService,
  ) {}

  @Query('users')
  users() {
    return this.graphqlService.findAllUser();
  }

  @Query('user')
  async user(@Args('id') id: number) {
    return this.graphqlService.findUserById(id);
  }


  @ResolveField()
  async posts(@Parent() user) {
    const { id } = user;
    return this.graphqlService.findAllPost(id);
  }

  @ResolveField()
  async profile(@Parent() user) {
    const { id } = user;
    return this.graphqlService.findProfileById(id);
  }

}

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly praticePrismaService: PraticePrismaService,
  ) {}

  @Query('users')
  users() {
    return this.graphqlService.findAllUser(); 
  }

  @Query('user')
  async user(@Args('id') id: number) {
    return this.graphqlService.findUserById(id);
  }


  @Query('posts')
  getAllPosts() {
    return this.graphqlService.findAllPost();
  }

  @ResolveField()
  async author(@Parent() post) {
    const { authorId } = post;
    return this.graphqlService.findUserById(authorId);
  }

  @Mutation('increaseViewCount')
  async increaseViewCount(@Args('postId') postId: string) {
    return this.graphqlService.increaseViewCount(postId);
  }

  @Mutation('addPost')
  async addPost(@Args('post') post: AddPostInput) {
    const newPost = await this.graphqlService.addPost(post);
    return newPost[0];
  }

  @Mutation('deletePost')
  async deletePost(@Args('postId') postId: string) {
    return this.graphqlService.deletePost(postId);
  }

  @Mutation('updatePost')
  async updatePost(@Args('postId') postId: number, @Args('editPost') editPost: EditPostInput) {
    return this.graphqlService.updatePost(postId, editPost);
  }
}
