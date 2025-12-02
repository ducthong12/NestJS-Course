import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketModule } from './ticket/ticket.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { PraticePrismaModule } from './pratice_prisma/pratice_prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    TicketModule,
    OrderModule,
    UserModule,
    DbModule,
    PraticePrismaModule,
    KafkaModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
