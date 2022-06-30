export default function useMessageParser(type, data) {
    switch (type) {
        case 'status':
            return `(STATUS): ${data}`;
        case 'messages':
            const [date, ...message] = data.message.split('|');
            return `[#${data.topic}] [${date}]: ${message.join(' ')}`;
        default:
            return '';
    }
}
