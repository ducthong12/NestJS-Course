import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInputGraphQl {
  @Field()
  id: number;

  @Field()
  name: string;
}
