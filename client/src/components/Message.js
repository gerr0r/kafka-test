import useMessageParser from '../hooks/useMessageParser.js';

const Message = ({ messageType, data }) => {
    const message = useMessageParser(messageType, data);
    return <div className="message">{message}</div>;
};

export default Message;
