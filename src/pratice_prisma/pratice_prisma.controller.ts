import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { PraticePrismaService } from './pratice_prisma.service';
import {
  CreateUserDto,
  CreateCategoryDto,
  CreatePostWithAuthorDto,
  CreateUserWithProfileDto,
} from './dto/create-pratice_prisma.dto';
import { UpdatePraticePrismaInput } from './dto/update-pratice_prisma.dto';
import { ValidateEmailPipe } from 'src/pipe/validate-email.pipe';
import { ValidateNamePipe } from 'src/pipe/validate-name.pipe';

@Controller('pratice-prisma')
export class PraticePrismaController {
  constructor(private readonly praticePrismaService: PraticePrismaService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.praticePrismaService.create(createUserDto);
  }

  @Post('/createMany')
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.praticePrismaService.createMany(createUserDto);
  }

  @Post('/createManyCategory')
  createManyCategory(@Body() createCategoryDto: CreateCategoryDto[]) {
    return this.praticePrismaService.createManyCategory(createCategoryDto);
  }

  @Get('/findEmail')
  findEmail(@Query('email', new ValidateEmailPipe()) email: string) {
    return this.praticePrismaService.findUnique({ email });
  }

  @Get('/getUsers')
  getUsers() {
    return this.praticePrismaService.findAll();
  }

  @Patch('/updateMany')
  updateMany(@Body() data: UpdatePraticePrismaInput) {
    return this.praticePrismaService.updateMany(data);
  }

  @Delete('/deleteCategory')
  deleteCategory(@Body('name', new ValidateNamePipe()) name: string) {
    return this.praticePrismaService.deleteUniqueCategory(name);
  }

  @Post('/createPostWithUser')
  createPostWithUser(@Body() data: CreatePostWithAuthorDto) {
    return this.praticePrismaService.createPostWithUser(data);
  }

  @Post('/createUserWithProfile')
  createUserWithProfile(@Body() data: CreateUserWithProfileDto) {
    return this.praticePrismaService.createUserWithProfile(data);
  }

  @Get('/findEmailWithPost')
  findEmailWithPost(@Query('email', new ValidateEmailPipe()) email: string) {
    return this.praticePrismaService.findEmailWithPost({ email });
  }

  @Get('/findPostSelectTitle')
  findPostSelectTitle() {
    return this.praticePrismaService.findPostSelectTitle();
  }

  @Get('/findUserWithLeastPost')
  findUserWithLeastPost() {
    return this.praticePrismaService.findUserWithLeastPost();
  }

  @Get('/findPostWithSearchName')
  findPostWithSearchName(@Query('name') name: string) {
    return this.praticePrismaService.findPostWithSearchName(name);
  }

  @Get('/findUserWithSort')
  findUserWithSort() {
    return this.praticePrismaService.findUserWithSort();
  }

  @Get('/findUserWithPagination')
  findUserWithPagination() {
    return this.praticePrismaService.findUserWithPagination();
  }

  @Get('/findPostWithViewCount')
  findPostWithViewCount() {
    return this.praticePrismaService.findPostWithViewCount();
  }

  @Get('/getCountByUser')
  getCountByUser() {
    return this.praticePrismaService.getCountByUser();
  }

  @Get('/getAvgViewCount')
  getAvgViewCount() {
    return this.praticePrismaService.getAvgViewCount();
  }

  @Post('/UpsertPost')
  upsertPost(@Body('id') id: number) {
    return this.praticePrismaService.upsertPost(id);
  }

  @Post('/findMultiData')
  findMultiData(@Body('id') id: number) {
    return this.praticePrismaService.findMultiData(id);
  }

  @Get('/findEmailByRawQuery')
  findEmailByRawQuery(@Query('email', new ValidateEmailPipe()) email: string) {
    return this.praticePrismaService.findEmailByRawQuery(email);
  }
}
