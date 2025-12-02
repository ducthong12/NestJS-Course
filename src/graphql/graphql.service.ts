import { Injectable } from '@nestjs/common';
import { CreateUserInputGraphQl } from './dto/create-user-graphql.input';
import { UpdateUserInputGraphQl } from './dto/update-user-graphql.input';

@Injectable()
export class GraphqlService {
  create(createUserInputGraphQl: CreateUserInputGraphQl) {
    return 'This action adds a new graphql';
  }

  findAll() {
    return `This action returns all graphql`;
  }

  findOne(id: number) {
    return `This action returns a #${id} graphql`;
  }

  update(id: number, updateUserInputGraphQl: UpdateUserInputGraphQl) {
    return `This action updates a #${id} graphql`;
  }

  remove(id: number) {
    return `This action removes a #${id} graphql`;
  }
}
