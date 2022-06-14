import { useEffect, useState } from 'react';
import { useSocketContext } from '../context/SocketContext.js';
import OutputWindow from './OutputWindow.js';
import MessageInput from './MessageInput.js';

import { SOCKET_SYSTEM_EVENTS, SOCKET_CLIENT_EVENTS, KAFKA_TOPICS } from '../common/constants.js';

const Main = () => {
    const [messages, setMessages] = useState([]);
    const [statusMessages, setStatusMessages] = useState([]);
    const socket = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.on(SOCKET_SYSTEM_EVENTS.CONNECT, () => {
            setMessages([]);
            let msg = 'Connection established';
            setStatusMessages((oldMessages) => [...oldMessages, msg]);

            socket.emit(SOCKET_CLIENT_EVENTS.CONSUME_KAFKA_MESSAGES, { topics: KAFKA_TOPICS, allMessages: true });
        });

        socket.on(SOCKET_SYSTEM_EVENTS.CONNECT_ERROR, (error) => {
            let msg = `Failed to connect. ${error}`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });

        socket.on(SOCKET_SYSTEM_EVENTS.DISCONNECT, (reason) => {
            let msg = `Disconnected. Reason: ${reason}`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });

        socket.io.on(SOCKET_SYSTEM_EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
            let msg = `Attempt to connect...(${attemptNumber})`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });

        socket.io.on(SOCKET_SYSTEM_EVENTS.RECONNECT_FAILED, () => {
            let msg = `Reconnection aborted after ${socket.io._reconnectionAttempts} retries.`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });

        socket.io.on(SOCKET_SYSTEM_EVENTS.RECONNECT, (attemptNumber) => {
            socket.off(SOCKET_SYSTEM_EVENTS.CONNECT);
            setMessages([]);
            let msg = `Connection established after ${attemptNumber} retries. Loading messages...`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);

            socket.emit(SOCKET_CLIENT_EVENTS.CONSUME_KAFKA_MESSAGES, { topics: KAFKA_TOPICS, allMessages: true });
        });

        socket.on(SOCKET_CLIENT_EVENTS.KAFKA_MESSAGE, ({ topic, message }) => {
            setMessages((oldMessages) => [...oldMessages, { topic, message }]);
        });
        return () => socket.offAny();
    }, [socket]);

    return (
        <main className="container">
            <MessageInput />
            <OutputWindow messages={messages} windowType="messages" />
            <OutputWindow messages={statusMessages} windowType="status" />
        </main>
    );
};

export default Main;
