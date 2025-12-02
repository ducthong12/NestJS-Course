import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInputGraphQl } from './create-user-graphql.input';
import { PartialType } from '@nestjs/mapped-types';

@InputType()
export class UpdateUserInputGraphQl extends PartialType(
  CreateUserInputGraphQl,
) {
  @Field()
  id: number;
}
