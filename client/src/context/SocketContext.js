import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { SOCKET_SERVER, SOCKET_SERVER_OPTIONS } from '../common/constants.js';

const SocketContext = createContext();

// export context as a hook
export const useSocketContext = () => {
    return useContext(SocketContext);
};

export default function SocketContextProvider({ children }) {
    const [socket, setSocket] = useState();

    useEffect(() => {
        const request = io(SOCKET_SERVER, SOCKET_SERVER_OPTIONS);
        setSocket(request);
        return () => request.disconnect();
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
