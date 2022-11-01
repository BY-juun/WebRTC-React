import React, { useRef } from "react";
import { useSetMyVideo } from "Hooks/useSetMyVideo";
import { useRecoilValue } from "recoil";
import { CameraOn } from "store";
import { DefaultCamera, VideoListWrapper } from "./styles";

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraOn = useRecoilValue(CameraOn);

  useSetMyVideo(videoRef);

  return (
    <VideoListWrapper>
      {cameraOn ? <video ref={videoRef} width="400" height="400" autoPlay playsInline /> : <DefaultCamera>안병준</DefaultCamera>}
    </VideoListWrapper>
  );
};

export default Video;
