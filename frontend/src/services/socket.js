import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance && typeof window !== 'undefined') {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.io Client] Connected with ID:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket.io Client] Connection warning:', err.message);
    });
  }
  return socketInstance;
};
