import React, { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CameraOn, MyStream } from "store";

const CameraBtn = () => {
  const [cameraOn, setCameraOn] = useRecoilState(CameraOn);
  const myStream = useRecoilValue(MyStream);

  const onClickCameraBtn = useCallback(() => {
    myStream?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setCameraOn((prev) => !prev);
  }, [myStream]);

  return <button onClick={onClickCameraBtn}>{cameraOn ? "비디오 끄기" : "비디오 시작"}</button>;
};

export default CameraBtn;
