import { useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../context/SocketContext.js';

import { SOCKET_CLIENT_EVENTS, KAFKA_TOPICS } from '../common/constants.js';
import RandomMessageGenerator from './RandomMessagesGenerator.js'; // For testing. Remove!

import useLocalStorage from '../hooks/useLocalStorage.js';

const MessageInput = () => {
    const userTopics = useLocalStorage('topics');
    const topics = userTopics.get() || [];
    const [topic, setTopic] = useState(KAFKA_TOPICS[0]);
    const [message, setMessage] = useState('');

    const socket = useSocketContext();
    const messageRef = useRef();

    function sendMessage(e) {
        e.preventDefault();
        socket.emit(
            SOCKET_CLIENT_EVENTS.PRODUCE_KAFKA_MESSAGE,
            { topic, message: `${new Date().toUTCString()}|${message.trim()}` },
            (response) => console.log('Produced message:', response)
        );
        setMessage('');
    }

    function getMessages(e) {
        e.preventDefault();
        userTopics.set(topic);
        socket.emit(SOCKET_CLIENT_EVENTS.CONSUME_KAFKA_MESSAGES, { topics: [topic], allMessages: true });
    }

    useEffect(() => messageRef.current.focus());

    return (
        <form className="message-input-container" onSubmit={sendMessage}>
            <select onChange={(e) => setTopic(e.target.value)}>
                {KAFKA_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                        {topic}
                    </option>
                ))}
            </select>
            <button onClick={getMessages} disabled={topics.includes(topic)}>
                Subscribe
            </button>
            <input
                placeholder={!topics.includes(topic) ? 'Subscribe to send message...' : null}
                ref={messageRef}
                className="message-input"
                type="text"
                value={message || ''}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus
            />
            <button type="submit" disabled={!Boolean(message.trim()) || !topics.includes(topic)}>
                SEND
            </button>
            <RandomMessageGenerator /> {/* For testing. Remove! */}
        </form>
    );
};

export default MessageInput;
