// kafka-retry.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaRetryService implements OnModuleInit {
  constructor(
    // Inject Kafka Client để dùng cho việc bắn DLQ
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Kết nối Producer để sẵn sàng bắn DLQ
    await this.kafkaClient.connect();
  }

  // --- HÀM CHUNG ĐỂ BỌC XỬ LÝ ---
  // T: Là kiểu dữ liệu của message (Generic type)
  async execute<T>(
    data: T,
    topic: string,
    handler: (data: T) => Promise<void> | void, // Hàm xử lý logic nghiệp vụ được truyền vào
    options: { maxRetries?: number; dlqSuffix?: string } = {},
  ) {
    const maxRetries = options.maxRetries || 3;
    const dlqSuffix = options.dlqSuffix || '.dlq';
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        // 1. Chạy hàm xử lý chính (Business Logic)
        await handler(data);

        // Nếu không lỗi -> Return ngay (Thành công)
        return;
      } catch (error) {
        attempt++;
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(
          `⚠️ [Retry Service] Lỗi lần ${attempt}/${maxRetries + 1}: ${errMsg}`,
        );

        if (attempt <= maxRetries) {
          // Chưa hết lượt -> Chờ và thử lại (Backoff strategy)
          const delay = 1000 * attempt; // Lần 1 chờ 1s, lần 2 chờ 2s...
          console.log(`⏳ Đang chờ ${delay}ms...`);
          await this.sleep(delay);
        } else {
          // Hết lượt -> Đẩy vào DLQ
          console.error('❌ Hết lượt retry! Chuyển sang DLQ.');
          this.sendToDLQ(data, topic, errMsg, dlqSuffix);
        }
      }
    }
  }

  private sendToDLQ(
    data: any,
    originalTopic: string,
    error: string,
    suffix: string,
  ) {
    const dlqTopic = `${originalTopic}${suffix}`;
    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      originalData: data,
      error: error,
      failedAt: new Date().toISOString(),
    };
    this.kafkaClient.emit(dlqTopic, payload);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
