# Server - client websockets connection

Run the environment:

`docker-compose up --build`

This will spin up:

 - Zookeeper on port 2181
 - Kafka broker on port 9092
 - NestJS socket server on port 4000 with kafka consumer and producer
 - React app client on port 3000

*Note:*
React client uses local storage for subscriptions.\
Delete `topics` key if facing issues.
