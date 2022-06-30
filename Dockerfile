FROM confluentinc/cp-kafka:latest

RUN echo 'alias topics="kafka-topics --list --bootstrap-server localhost:9092"' >> ~/.bashrc
RUN echo 'alias consumer="kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic"' >> ~/.bashrc
RUN echo 'alias consumer_all="kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --include '\''.*'\''"' >> ~/.bashrc
RUN source /home/appuser/.bashrc
