import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { Socket } from 'net';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    clientId: 'app-id',
    brokers: ['localhost:19092', 'localhost:29092', 'localhost:39092'],
  });
  private readonly consumers: Consumer[] = [];

  // async onModuleInit() {
  //   await this.consume(
  //     {
  //       topics: ['test'],
  //       fromBeginning: true,
  //     },
  //     {
  //       eachMessage: async ({ topic, partition, message }) => {
  //         console.log({
  //           value: message.value.toString(),
  //           topic: topic.toString(),
  //           partition: partition.toString(),
  //         });
  //       },
  //     },
  //   );
  // }

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: `weather-alerts-generation-server-${uuid()}`,
    });
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    // await consumer.disconnect();
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
