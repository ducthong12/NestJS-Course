import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // Tên token để inject
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
          },
          consumer: {
            groupId: 'my-producer-group', // Producer cũng cần group ID để nhận reply (nếu có)
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
})
export class KafkaModule {}
