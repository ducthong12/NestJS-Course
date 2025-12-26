
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'node:path';

// npx ts-node src/graphql/generate-typing.ts to run

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql/dto/graphql.ts'),
  outputAs: 'class',
  watch: true,
  emitTypenameField: true,
  skipResolverArgs: true,
  enumsAsTypes: true,
});
