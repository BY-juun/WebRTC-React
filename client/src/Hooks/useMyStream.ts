import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { MyStream } from "store";

export function useMyStream() {
  const setMyStream = useSetRecoilState(MyStream);

  const getMedia = useCallback(async () => {
    try {
      const myStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
      setMyStream(myStream);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getMedia();
  }, []);
}
