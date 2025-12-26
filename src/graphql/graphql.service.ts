import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateUserInputGraphQl } from './dto/create-user-graphql.input';
import { AddPostInput, EditPostInput, Profile, User } from './dto/graphql';


@Injectable()
export class GraphqlService {
  constructor(private prismaService: PrismaService) {}
  create(createUserInputGraphQl: CreateUserInputGraphQl) {
    return 'This action adds a new graphql';
  }

  findAllUser() {
    return this.prismaService.user.findMany();
  }

  findUserById(id: number) {
     return (
      this.prismaService.$queryRaw<User>`
        SELECT 
          id,
          name,
          role 
        FROM "User" 
        WHERE id = Cast(${id} as int)
      `
        // Lấy phần tử đầu tiên của mảng (hoặc null/undefined nếu mảng rỗng)
        .then((result: User) => {
          const user = result[0]; // Lấy đối tượng User đầu tiên
          if (!user) {
            return null; // Trả về null nếu không tìm thấy người dùng
          }
          // Ép kiểu User sang UserOutput
          return user as unknown as User;
        })
    );
  }

  findAllPost(parentId?: string) {
    if(parentId) {
      return this.prismaService.post.findMany({
        where: {
          authorId: parseInt(parentId), // parentId
        }
      });
    }
    else return this.prismaService.post.findMany();
  }


  findProfileById(id: number) {
    return (
     this.prismaService.$queryRaw<Profile>`
       SELECT 
         id,
         bio
       FROM "Profile" 
       WHERE id = Cast(${id} as int)
     `
       // Lấy phần tử đầu tiên của mảng (hoặc null/undefined nếu mảng rỗng)
       .then((result: Profile) => {
         const profile = result[0]; // Lấy đối tượng User đầu tiên
         if (!profile) {
           return null; // Trả về null nếu không tìm thấy người dùng
         }
         // Ép kiểu User sang UserOutput
         return profile as unknown as Profile;
       })
   );
 }

 increaseViewCount(postId: string) {
  return this.prismaService.post.update({
    where: {
      id: parseInt(postId),
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
 }

 addPost(post: AddPostInput) {
  return this.prismaService.$queryRaw<AddPostInput>`
    INSERT INTO "Post" ("title", "content", "authorId", "updatedAt")
    VALUES (${post.title}, ${post.content}, Cast(${post.authorId} as int), now())
    RETURNING *
  `
   
 }

 deletePost(postId: string) {
  return this.prismaService.post.delete({
    where: {
      id: parseInt(postId),
    },
  });
 }

 updatePost(postId: number, editPost: EditPostInput) {

  return this.prismaService.post.update({
    where: {
      id: parseInt(postId as any),
    },
    data: editPost as any,
  });
 }
  // async findOne(id: number) {
  //   return (
  //     this.prismaService.$queryRaw<User>`
  //       SELECT 
  //         id,
  //         name,
  //         role 
  //       FROM "User" 
  //       WHERE id = Cast(${id} as int)
  //     `
  //       // Lấy phần tử đầu tiên của mảng (hoặc null/undefined nếu mảng rỗng)
  //       .then((result: User) => {
  //         const user = result[0]; // Lấy đối tượng User đầu tiên
  //         if (!user) {
  //           return null; // Trả về null nếu không tìm thấy người dùng
  //         }
  //         // Ép kiểu User sang UserOutput
  //         return user as unknown as User;
  //       })
  //   );
  // }
}
