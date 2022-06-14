import { Module } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway, ProducerService, ConsumerService],
})
export class EventsModule {}
