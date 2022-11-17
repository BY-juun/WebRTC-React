import CameraBtn from "components/cameraBtn";
import MuteBtn from "components/muteBtn";
import React, { useEffect, useRef } from "react";
import Video from "components/Video";
import { useWebRTC } from "Hooks/useWebRTC";
import { useMyStream } from "Hooks/useMyStream";
import { useDisconnectSocket } from "Hooks/useDisconnectSocket";
import CameraSelector from "components/cameraSelector";
import PeerVideo from "components/peerVideo";

const Room = () => {
  const usersStream = useWebRTC();
  useMyStream();
  useDisconnectSocket();

  return (
    <>
      <Video />
      {usersStream.map((data, idx) => (
        <PeerVideo stream={data.stream} key={idx} />
      ))}
      <CameraSelector />
      <MuteBtn />
      <CameraBtn />
    </>
  );
};

export default Room;
