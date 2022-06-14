import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ConsumerService } from './kafka/consumer.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
