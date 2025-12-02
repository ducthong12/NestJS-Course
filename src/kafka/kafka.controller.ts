import { Controller, Get, UseFilters } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KafkaMaxRetryExceptionFilter } from './kafka-max-retry.service';

@Controller('kafka')
export class KafkaController {
  constructor(private kafkaService: KafkaService) {}

  @Get('create-user')
  createUser() {
    return this.kafkaService.createUser();
  }

  @EventPattern('user_created')
  receiveUser(@Payload() message: string) {
    console.log('Received user created event:', message);
  }

  @Get('sum')
  calculateSum() {
    // send: Gửi đi và trả về một Observable (chờ kết quả)
    return this.kafkaService.calculateSum();
  }

  @MessagePattern('calculate_sum')
  sum(@Payload() data: { a: number; b: number }): number {
    console.log('Đang tính tổng...');
    return data.a + data.b; // Giá trị return này sẽ được gửi ngược lại Service A
  }

  @Get('order_payment')
  orderPayment() {
    // send: Gửi đi và trả về một Observable (chờ kết quả)
    return this.kafkaService.orderPayment();
  }

  @EventPattern('order_payment')
  @UseFilters(new KafkaMaxRetryExceptionFilter(3))
  async handleOrderPayment(
    @Payload() message: { orderId: string },
    @Ctx() context: KafkaContext, // Inject Context vào
  ) {
    const originalMessage = context.getMessage();
    const offset = originalMessage.offset;
    const partition = context.getPartition();
    const topic = context.getTopic();

    console.log(
      `Processing Order: ${message.orderId} at P:${partition} O:${offset}`,
    );

    try {
      // 1. Xử lý logic nghiệp vụ (Ví dụ: Trừ tiền, Update DB)
      this.processPayment();

      // 2. Nếu thành công -> Mới Commit Offset
      // Đây là hành động xác nhận: "Tôi đã xử lý xong, hãy đánh dấu tin này là đã đọc"
      const consumer = context.getConsumer(); // Lấy KafkaJS consumer instance

      // Commit chính xác offset vừa xử lý + 1
      await consumer.commitOffsets([
        {
          topic,
          partition,
          offset: (Number(offset) + 1).toString(),
        },
      ]);

      console.log('Committed successfully');
    } catch {
      console.error('Lỗi xử lý, KHÔNG commit offset để Kafka gửi lại lần sau');
      // Tùy chọn: Đẩy vào Dead Letter Queue (DLQ) nếu retry nhiều lần thất bại
    }
  }

  processPayment() {
    // Giả lập xử lý
    if (Math.random() < 0.1) throw new Error('DB Error'); // Giả lập lỗi 10%
    return true;
  }
}
