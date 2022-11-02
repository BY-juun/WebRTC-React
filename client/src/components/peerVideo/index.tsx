import React, { useEffect, useRef } from "react";

const PeerVideo = ({ stream }: { stream: any }) => {
  const peervideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!peervideoRef.current) return;
    if (!stream) return;
    peervideoRef.current.srcObject = stream;
  }, [stream]);

  return <video ref={peervideoRef} width="400" height="400" autoPlay playsInline />;
};

export default PeerVideo;
