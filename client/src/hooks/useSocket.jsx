import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000/", {
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Cleanup: Disconnect socket when component is unmounted
    return () => {
      socketInstance.disconnect();
    };
  }, []); // Only run on mount and unmount

  return socket;
};

export default useSocket;
