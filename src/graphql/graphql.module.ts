import { Module } from '@nestjs/common';
import { GraphqlService } from './graphql.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PraticePrismaService } from 'src/pratice_prisma/pratice_prisma.service';
import { PrismaService } from 'src/config/prisma.service';
import { GraphqlResolver } from './graphql.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/dto/graphql.ts'),
        outputAs: 'class',
      },
      sortSchema: true,
    }),
  ],
  providers: [
    GraphqlResolver,
    GraphqlService,
    PraticePrismaService,
    PrismaService,
  ],
})
export class GraphqlModule {}
