// For testing. Remove!

import { SOCKET_CLIENT_EVENTS } from '../common/constants.js';
import { useSocketContext } from '../context/SocketContext.js';

const countryCodes = ['BG', 'DE', 'IN', 'US', 'FR'];
const weatherTypes = ['sunny', 'cloudy', 'windy', 'rainy', 'stormy'];

const RandomMessageGenerator = ({ numberOfMessages = 10 }) => {
    const socket = useSocketContext();

    function sendRandomMessages() {
        for (let i = 0; i < numberOfMessages; i++) {
            const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const temperature = Math.floor(Math.random() * 12) + 20;
            const topic = countryCodes[Math.floor(Math.random() * countryCodes.length)];
            const message = `Expected ${weather} weather and average temperature ~${temperature}˚C`;

            socket.emit(
                SOCKET_CLIENT_EVENTS.PRODUCE_KAFKA_MESSAGE,
                { topic, message: `${new Date()}: ${message}` },
                (response) => console.log('Produced message:', response)
            );
        }
    }

    return (
        <button type="button" onClick={sendRandomMessages}>
            RANDOM
        </button>
    );
};

export default RandomMessageGenerator;
