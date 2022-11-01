import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { CameraOn, MyStream } from "store";

export function useSetMyVideo(videoRef: React.RefObject<HTMLVideoElement>) {
  const myStream = useRecoilValue(MyStream);
  const cameraOn = useRecoilValue(CameraOn);
  useEffect(() => {
    if (!videoRef.current) return;
    if (!myStream) return;
    if (cameraOn) videoRef.current.srcObject = myStream;
  }, [myStream, cameraOn]);
}
