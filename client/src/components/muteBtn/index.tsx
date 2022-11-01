import React, { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { MuteOn, MyStream } from "store";

const MuteBtn = () => {
  const [mute, setMute] = useRecoilState(MuteOn);
  const myStream = useRecoilValue(MyStream);

  const onClickMuteBtn = useCallback(() => {
    myStream?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMute((prev) => !prev);
  }, [myStream]);

  return <button onClick={onClickMuteBtn}>{mute ? "음소거 해제" : "음소거"}</button>;
};

export default MuteBtn;
