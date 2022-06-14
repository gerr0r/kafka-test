export default function useMessageParser(type, data) {
    switch (type) {
        case 'status':
            return `(STATUS): ${data}`;
        case 'messages':
            return `(TOPIC ${data.topic}): ${data.message}`;
        default:
            return '';
    }
}
