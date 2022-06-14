import { useEffect, useRef } from 'react';
import Message from './Message.js';

const OutputWindow = ({ messages, windowType }) => {
    const bottomRef = useRef();
    const scrollBottom = () => bottomRef.current.scrollIntoView();

    useEffect(() => scrollBottom(), [messages]);

    return (
        <div className={`output-container ${windowType}-window`}>
            {messages.map((message, index) => (
                <Message key={index} messageType={windowType} data={message} />
            ))}
            <div ref={bottomRef}></div>
        </div>
    );
};

export default OutputWindow;
