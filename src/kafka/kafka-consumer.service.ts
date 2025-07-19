import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumerService {
  private readonly consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    const kafka = new Kafka({
      brokers: [this.configService.get<string>('KAFKA_BROKER')!],
    });

    this.consumer = kafka.consumer({ groupId: 'bid-consumer' });
  }

  async connectAndSubscribe(
    topic: string,
    onMessage: (value: string) => Promise<void>,
  ) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          await onMessage(value);
        }
      },
    });
  }
}
