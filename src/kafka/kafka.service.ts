import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaRetryService } from './kafka-retry.service';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly retryService: KafkaRetryService,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('calculate_sum');
    await this.client.connect();
  }

  createUser() {
    const user = { id: 1, name: 'Gemini', email: 'test@gmail.com' };

    // emit: Gửi đi và không quan tâm kết quả (Fire-and-forget)
    this.client.emit('user_created', JSON.stringify(user));

    return 'User creation event sent!';
  }

  calculateSum() {
    // send: Gửi đi và trả về một Observable (chờ kết quả)
    return this.client.send('calculate_sum', { a: 1, b: 2 });
  }

  orderPayment() {
    // send: Gửi đi và trả về một Observable (chờ kết quả)
    return this.client.emit('order_payment', { orderId: '12345' });
  }

  // Đây là hàm sẽ được gọi từ Controller
  async processOrder(data: { id: string; name: string }, topic: string) {
    // GỌI HÀM BỌC:
    await this.retryService.execute(
      data,
      topic,
      // Truyền logic nghiệp vụ vào dưới dạng Arrow Function
      (msg) => {
        this.handleBusinessLogic(msg);
      },
      // Option tùy chỉnh (nếu muốn)
      { maxRetries: 3 },
    );
  }

  // Logic nghiệp vụ thuần túy (Không cần quan tâm retry/dlq ở đây nữa)
  private handleBusinessLogic(data: { id: string; name: string }) {
    console.log(`🏭 Đang xử lý logic cho Order ID: ${data.id}`);

    // Giả lập lỗi
    if (Math.random() < 0.7) {
      throw new Error('DB Connection Failed');
    }

    console.log('✅ Xử lý Order thành công!');
    // Save DB, Call API...
  }
}
