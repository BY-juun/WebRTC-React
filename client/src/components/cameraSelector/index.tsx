import React, { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { MyStream } from "store";

const CameraSelector = () => {
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[] | null>(null);
  const setMyStream = useSetRecoilState(MyStream);
  const setOptions = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    setCameraList(cameras);
  }, []);

  useEffect(() => {
    setOptions();
  }, []);

  const onChangeCamera = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    const myStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId: { exact: deviceId } } });
    setMyStream(myStream);
  }, []);

  return (
    <select onChange={onChangeCamera}>
      {cameraList &&
        cameraList.map((camera) => (
          <option value={camera.deviceId} key={camera.deviceId}>
            {camera.label}
          </option>
        ))}
    </select>
  );
};

export default CameraSelector;
