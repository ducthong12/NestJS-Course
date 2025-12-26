import { Field, ObjectType } from '@nestjs/graphql';

//@ObjectType()
// export class UserOutputGraphQlDto {
//   @Field()
//   email: string;

//   @Field({ nullable: true })
//   name?: string;
// }

export class UserOutputGraphQlDto {

  id: string;

  name: string;

  role: string;
}

