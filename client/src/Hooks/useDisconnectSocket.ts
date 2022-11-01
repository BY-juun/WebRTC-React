import { useEffect } from "react";
import { useSocket } from "./useSocket";

export function useDisconnectSocket() {
  const [, disconnect] = useSocket();
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);
}
