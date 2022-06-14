export const SOCKET_SERVER = 'http://localhost:4000';
export const SOCKET_SERVER_OPTIONS = {
    reconnectionAttempts: 99
};
export const SOCKET_SYSTEM_EVENTS = {
    CONNECT: 'connect',
    CONNECT_ERROR: 'connect_error',
    DISCONNECT: 'disconnect',
    RECONNECT_ATTEMPT: 'reconnect_attempt',
    RECONNECT_FAILED: 'reconnect_failed',
    RECONNECT: 'reconnect'
};
export const SOCKET_CLIENT_EVENTS = {
    CONSUME_KAFKA_MESSAGES: 'consume-kafka-messages',
    KAFKA_MESSAGE: 'kafka-message',
    PRODUCE_KAFKA_MESSAGE: 'produce-kafka-message'
};

export const KAFKA_TOPICS = ['BG', 'DE'];
