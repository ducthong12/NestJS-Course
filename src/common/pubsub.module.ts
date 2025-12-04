import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Dùng để lấy biến môi trường
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const PUB_SUB = 'PUB_SUB';

@Global() // Quan trọng: Để dùng được ở mọi nơi (UserModule, PostModule,...)
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        // Lấy cấu hình từ .env hoặc mặc định
        const redisOptions = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          host: configService.get('REDIS_HOST', 'localhost'),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          port: configService.get('REDIS_PORT', 6379),
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return new RedisPubSub({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
          publisher: new Redis(redisOptions),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
          subscriber: new Redis(redisOptions),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
