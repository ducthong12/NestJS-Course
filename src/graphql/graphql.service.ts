import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphqlService {
  create() {
    return 'This action adds a new graphql';
  }

  findAll() {
    return `This action returns all graphql`;
  }

  findOne(id: number) {
    return `This action returns a #${id} graphql`;
  }

  update(id: number) {
    return `This action updates a #${id} graphql`;
  }

  remove(id: number) {
    return `This action removes a #${id} graphql`;
  }
}
