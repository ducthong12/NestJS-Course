import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  CreateCategoryDto,
  CreatePostWithAuthorDto,
  CreateUserWithProfileDto,
} from './dto/create-pratice_prisma.dto';
import { UpdatePraticePrismaInput } from './dto/update-pratice_prisma.dto';
import { PrismaService } from '../config/prisma.service';
import { Prisma } from '@generated/prisma';
import { UserOutput } from 'src/graphql/dto/graphql';

@Injectable()
export class PraticePrismaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  createMany(createUserDto: CreateUserDto[]) {
    return this.prisma.user.createMany({ data: createUserDto });
  }

  createManyCategory(createCategoryDto: CreateCategoryDto[]) {
    return this.prisma.category.createMany({ data: createCategoryDto });
  }

  findUnique(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  updateMany({ where, data }: UpdatePraticePrismaInput) {
    return this.prisma.user.updateMany({ where, data });
  }

  deleteUniqueCategory(name: string) {
    return this.prisma.category.deleteMany({
      where: {
        name: name,
      },
    });
  }

  createPostWithUser(data: CreatePostWithAuthorDto) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        author: {
          connect: { email: data.email },
        },
      },
    });
  }

  createUserWithProfile(data: CreateUserWithProfileDto) {
    return this.prisma.user.create({
      data: {
        ...data.user,
        profile: {
          create: { ...data.profile },
        },
      },
    });
  }

  findEmailWithPost({ email }: { email: string }) {
    // return this.prisma.user.findUnique({
    //   where: { email },
    //   include: { posts: true },
    // });
    return (
      this.prisma.$queryRaw<UserOutput[]>`
        SELECT 
          id, email, name 
        FROM "User" 
        WHERE email = ${email}
      `
        // Lấy phần tử đầu tiên của mảng (hoặc null/undefined nếu mảng rỗng)
        .then((resultArray: UserOutput[]) => {
          const user = resultArray[0]; // Lấy đối tượng User đầu tiên

          if (!user) {
            return null; // Trả về null nếu không tìm thấy người dùng
          }

          // Ép kiểu User sang UserOutput
          return user as unknown as UserOutput;
        })
    );
  }

  findPostSelectTitle() {
    return this.prisma.post.findMany({
      select: {
        // title: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findUserWithLeastPost() {
    return this.prisma.user.findMany({
      where: { posts: { some: {} } },
      include: { posts: true },
    });
  }

  findPostWithSearchName(name: string) {
    return this.prisma.post.findMany({
      where: { title: { contains: name }, published: false },
    });
  }

  findUserWithSort() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findUserWithPagination() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: 1,
      take: 2,
    });
  }

  findPostWithViewCount() {
    return this.prisma.post.findMany({
      where: {
        OR: [{ viewCount: { gt: 10 } }, { viewCount: { gte: 10 } }],
      },
    });
  }

  getCountByUser() {
    return this.prisma.user.count();
  }

  getAvgViewCount() {
    // average viewCount per user (author) by grouping posts by authorId
    return this.prisma.post.groupBy({
      by: ['authorId'],
      _avg: {
        viewCount: true,
      },
    });
  }

  upsertPost(id: number) {
    return this.prisma.post.upsert({
      where: { id: id },
      create: {
        title: 'New Post',
        author: {
          connect: { id: 1 },
        },
      },
      update: {
        title: 'Updated Post',
      },
    });
  }

  findMultiData(id: number) {
    return this.prisma.$transaction([
      this.prisma.post.upsert({
        where: { id: id },
        create: {
          title: 'New Post',
          author: {
            connect: { id: id },
          },
        },
        update: {
          title: 'Updated Post',
        },
      }),
      this.prisma.post.findMany({ where: { authorId: 1 } }),
    ]);
  }

  findEmailByRawQuery(email: string) {
    return this.prisma.$queryRawUnsafe(
      `SELECT * FROM public."User" WHERE email = $1`,
      email,
    );
  }
}
