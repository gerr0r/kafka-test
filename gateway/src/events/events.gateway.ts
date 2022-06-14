import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('consume-kafka-messages')
  async consumeKafkaMessages(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<Observable<WsResponse<number>>> {
    console.log(data);

    await this.consumerService.consume(
      {
        topics: data.topics,
        fromBeginning: data.allMessages,
      },
      {
        eachMessage: async ({ topic, message }) => {
          client.emit('kafka-message', {
            topic: topic.toString(),
            message: message.value.toString(),
          });
        },
      },
    );

    return;
    // console.log(messages);

    // return from(messages).pipe(
    //   map((item) => ({ event: 'consume-events', data: item })),
    // );
  }

  @SubscribeMessage('produce-kafka-message')
  async produceKafkaMessage(@MessageBody() data: any): Promise<any> {
    console.log(data);
    const { topic, message: value } = data;

    await this.producerService.produce({
      topic,
      messages: [{ value }],
    });
    return data.message;
  }
}
