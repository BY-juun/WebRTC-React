import CameraBtn from "components/cameraBtn";
import MuteBtn from "components/muteBtn";
import React, { useEffect, useRef } from "react";
import Video from "components/Video";
import { useWebRTC } from "Hooks/useWebRTC";
import { useMyStream } from "Hooks/useMyStream";
import { useDisconnectSocket } from "Hooks/useDisconnectSocket";
import CameraSelector from "components/cameraSelector";

const Room = () => {
  const otherUserVideoRef = useRef<HTMLVideoElement>(null);
  useMyStream();
  useWebRTC(otherUserVideoRef);
  useDisconnectSocket();
  return (
    <>
      <Video />
      <video ref={otherUserVideoRef} width="400" height="400" autoPlay playsInline />
      <CameraSelector />
      <MuteBtn />
      <CameraBtn />
    </>
  );
};

export default Room;
