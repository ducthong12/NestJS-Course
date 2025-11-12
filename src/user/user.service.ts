import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  private dbService: DbService;

  async login(loginUserDto: LoginUserDto) {
    //Read file
    const users = await this.dbService.read();

    const userFound = users.find(
      (item) => item.accountName == loginUserDto.accountName,
    );

    if (!userFound || userFound.password != loginUserDto.password) {
      throw new BadRequestException(`Login Failed`);
    }

    return userFound;
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = new User();
    user.accountName = registerUserDto.accountName;
    user.password = registerUserDto.password;
    //Read file
    const users = await this.dbService.read();

    const userFound = users.some(
      (item) => item.accountName == user.accountName,
    );

    if (userFound) {
      throw new BadRequestException(`User ${user.accountName} already`);
    }

    //Save file
    users.push(user);
    await this.dbService.write(users);

    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
