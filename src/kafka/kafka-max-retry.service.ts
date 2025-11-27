import { Catch, ArgumentsHost, Logger, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ClientKafka, KafkaContext } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Catch()
export class KafkaMaxRetryExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(KafkaMaxRetryExceptionFilter.name);

  // Inject Kafka Client để gửi tin nhắn sang DLT
  @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka;

  constructor(
    private readonly maxRetries: number,
    // Tùy chọn: Hàm custom xử lý logic skip
    private readonly skipHandler?: (message: any) => Promise<void>,
    // Tùy chọn: Hậu tố cho Dead Letter Topic (ví dụ: .dlt hoặc .dead_letter)
    private readonly dltSuffix: string = '.dead_letter',
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const kafkaContext = host.switchToRpc().getContext<KafkaContext>();
    const message = kafkaContext.getMessage();
    const currentRetryCount = this.getRetryCountFromContext(kafkaContext);

    // Nếu đã hết lượt Retry
    if (currentRetryCount >= this.maxRetries) {
      this.logger.warn(
        `Max retries (${this.maxRetries}) exceeded. Moving to DLT...`,
      );

      // Xử lý background: Gửi sang DLT -> Chạy skipHandler -> Commit Offset
      (async () => {
        try {
          // 1. Gửi sang Dead Letter Topic
          await this.sendToDeadLetterTopic(kafkaContext, exception);

          // 2. Chạy skipHandler (nếu có)
          if (this.skipHandler) {
            await this.skipHandler(message);
          }

          // 3. Commit offset tin nhắn gốc (để không bị đọc lại nữa)
          await this.commitOffset(kafkaContext);

          this.logger.log(
            'Message successfully moved to DLT and offset committed.',
          );
        } catch (err) {
          // Nếu lỗi trong quá trình gửi DLT hoặc Commit, log lại nghiêm trọng
          // Lưu ý: Nếu không commit được, message sẽ bị lặp lại ở lần sau.
          this.logger.error(
            'CRITICAL: Failed to move message to DLT or Commit offset',
            err,
          );
        }
      })().catch((err) =>
        this.logger.error('Unhandled error in background DLT flow', err),
      );

      return; // Ngăn chặn exception lan truyền (để consumer không crash/retry mặc định của Nest)
    }

    // Nếu chưa hết retry, để NestJS xử lý bình thường (thường là sẽ retry)
    super.catch(exception, host);
  }

  /**
   * Logic gửi tin nhắn sang Topic chết (DLT)
   */
  private async sendToDeadLetterTopic(
    context: KafkaContext,
    exception: unknown,
  ): Promise<void> {
    const originalTopic = context.getTopic();
    const dltTopic = `${originalTopic}${this.dltSuffix}`; // VD: orders.dead_letter

    const message = context.getMessage();
    const { key, value, headers } = message;

    // Thêm metadata vào header để sau này debug dễ hơn (tại sao lỗi, lỗi gì)
    const dltHeaders = {
      ...headers, // Giữ lại headers cũ
      'x-original-topic': originalTopic,
      'x-exception-message':
        exception instanceof Error ? exception.message : String(exception),
      'x-exception-stack': exception instanceof Error ? exception.stack : '',
      'x-failed-at': new Date().toISOString(),
    };

    // Gửi tin nhắn. Chú ý: Cần await observable convert sang promise
    await lastValueFrom(
      this.kafkaClient.emit(dltTopic, {
        key: key, // Giữ nguyên key để đảm bảo partition (nếu cần)
        value: value, // Giữ nguyên body message
        headers: dltHeaders,
      }),
    );

    this.logger.log(`Sent failed message to topic: ${dltTopic}`);
  }

  // --- Các hàm cũ giữ nguyên ---

  private getRetryCountFromContext(context: KafkaContext): number {
    const headers = context.getMessage().headers || {};
    // Parse header, hỗ trợ cả Buffer nếu Kafka client trả về Buffer
    const retryHeader = headers['retryCount'] || headers['retry-count'];
    if (Buffer.isBuffer(retryHeader)) {
      return Number(retryHeader.toString());
    }
    return retryHeader ? Number(retryHeader) : 0;
  }

  private async commitOffset(context: KafkaContext): Promise<void> {
    const consumer = context.getConsumer(); // getConsumer không cần gọi hàm nếu dùng bản mới, nhưng code cũ của bạn có gọi ()
    if (!consumer) {
      throw new Error('Consumer instance is not available from KafkaContext.');
    }

    const topic = context.getTopic();
    const partition = context.getPartition();
    const message = context.getMessage();
    const offset = message.offset;

    if (!topic || partition === undefined || offset === undefined) {
      throw new Error(
        'Incomplete Kafka message context for committing offset.',
      );
    }

    await consumer.commitOffsets([
      {
        topic,
        partition,
        offset: (Number(offset) + 1).toString(),
      },
    ]);
  }
}
