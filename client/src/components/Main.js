import { useEffect, useState } from 'react';
import { useSocketContext } from '../context/SocketContext.js';
import OutputWindow from './OutputWindow.js';
import MessageInput from './MessageInput.js';

import { SOCKET_SYSTEM_EVENTS, SOCKET_CLIENT_EVENTS } from '../common/constants.js';

import useLocalStorage from '../hooks/useLocalStorage.js';

const Main = () => {
    const userTopics = useLocalStorage('topics');
    const [messages, setMessages] = useState([]);
    const [statusMessages, setStatusMessages] = useState([]);
    const socket = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.on(SOCKET_SYSTEM_EVENTS.CONNECT, () => {
            setMessages([]);
            let msg = 'Connection established';
            setStatusMessages((oldMessages) => [...oldMessages, msg]);

            // If user is subscribed to topics upon connection request for messages should go here
            const topics = userTopics.get();
            if (topics.length === 0) return;
            socket.emit(SOCKET_CLIENT_EVENTS.CONSUME_KAFKA_MESSAGES, { topics, allMessages: true });
        });

        return () => socket.off(SOCKET_SYSTEM_EVENTS.CONNECT);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on(SOCKET_SYSTEM_EVENTS.CONNECT_ERROR, (error) => {
            let msg = `Failed to connect. ${error}`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });
        return () => socket.off(SOCKET_SYSTEM_EVENTS.CONNECT_ERROR);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on(SOCKET_SYSTEM_EVENTS.DISCONNECT, (reason) => {
            let msg = `Disconnected. Reason: ${reason}`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });
        return () => socket.off(SOCKET_SYSTEM_EVENTS.DISCONNECT);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.io.on(SOCKET_SYSTEM_EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
            let msg = `Attempt to connect...(${attemptNumber})`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });
        return () => socket.off(SOCKET_SYSTEM_EVENTS.RECONNECT_ATTEMPT);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.io.on(SOCKET_SYSTEM_EVENTS.RECONNECT_FAILED, () => {
            let msg = `Reconnection aborted after ${socket.io._reconnectionAttempts} retries.`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);
        });
        return () => socket.off(SOCKET_SYSTEM_EVENTS.RECONNECT_FAILED);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on(SOCKET_CLIENT_EVENTS.KAFKA_MESSAGE, ({ topic, message }) => {
            setMessages((oldMessages) => [...oldMessages, { topic, message }]);
        });
        return () => socket.off(SOCKET_CLIENT_EVENTS.KAFKA_MESSAGE);
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.io.on(SOCKET_SYSTEM_EVENTS.RECONNECT, (attemptNumber) => {
            socket.off(SOCKET_SYSTEM_EVENTS.CONNECT);
            setMessages([]);
            let msg = `Connection established after ${attemptNumber} retries. Loading messages...`;
            setStatusMessages((oldMessages) => [...oldMessages, msg]);

            // store topics in context to reload messages from them upon reconnect
            const topics = userTopics.get();
            if (topics.length === 0) return;
            socket.emit(SOCKET_CLIENT_EVENTS.CONSUME_KAFKA_MESSAGES, { topics, allMessages: true });
        });

        return () => socket.off(SOCKET_SYSTEM_EVENTS.RECONNECT);
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
