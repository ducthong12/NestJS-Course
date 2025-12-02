import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Attach Kafka microservice to the HTTP application
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
      },
      consumer: {
        groupId: 'user-consumer-group', // Quan trọng: Định danh nhóm consumer
      },
      run: {
        autoCommit: false,
      },
    },
  });

  // Start microservices before starting the HTTP server
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  // //Enable cors
  app.enableCors();
  app.useStaticAssets(join(__dirname, '../uploads'));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log('Application is running...');
  })
  .catch((error: any) => {
    console.log('Application is failed...', error);
  });
