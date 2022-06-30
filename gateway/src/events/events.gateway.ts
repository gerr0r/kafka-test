import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
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
  ): Promise<any> {
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
  }

  @SubscribeMessage('produce-kafka-message')
  async produceKafkaMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): Promise<any> {
    const { topic, message: value } = data;
    console.log(`[SocketID: ${client['id']}]`, `[Topic: ${topic}]`, `Message: ${value}`);

    await this.producerService.produce({
      topic,
      messages: [{ value }],
    });
    return data.message; // to FE socket.emit callback function
  }
}
