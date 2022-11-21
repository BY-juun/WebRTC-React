import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MyStream } from "store";
import { useSocket } from "./useSocket";

// const myPeerConnection = new RTCPeerConnection();

// 먼저 들어온 사람이 나갔다가 들어오거나 새로고침 하는 경우에 에러발생 -> setLocalDescription에러

const urls = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:stun2.l.google.com:19302",
  "stun:stun3.l.google.com:19302",
  "stun:stun4.l.google.com:19302",
];

export const useWebRTC = () => {
  const { roomIdx } = useParams();
  const [users, setUsers] = useState<any[]>([]);
  const [socket, _] = useSocket();
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const myStream = useRecoilValue(MyStream);

  const createPeerConnection = (socketID: string) => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls }] });
      myStream?.getTracks().forEach((track) => pc.addTrack(track, myStream));
      pc.addEventListener("icecandidate", (e) => handleIce(e, socketID));
      pc.addEventListener("addstream", (e) => handleAddStream(e, socketID));
      return pc;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const welcomeCallback = async (socketID: string) => {
    const pc = createPeerConnection(socketID);
    if (!pc) return;
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
    peerConnections.current[socketID] = pc;
    socket.emit("offer", offer, socketID);
  };

  const offerCallback = async (offer: RTCSessionDescriptionInit, socketID: string) => {
    const pc = createPeerConnection(socketID);
    if (!pc) return;
    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    pc.setLocalDescription(answer);
    peerConnections.current[socketID] = pc;
    socket.emit("answer", answer, socketID);
  };

  const answerCallback = async (answer: RTCSessionDescriptionInit, socketID: string) => {
    peerConnections.current[socketID].setRemoteDescription(answer);
  };

  const iceCallback = (ice: RTCIceCandidateInit, socketID: string) => {
    peerConnections.current[socketID]?.addIceCandidate(ice);
  };

  const handleIce = (data: any, socketID: string) => {
    socket.emit("ice", data.candidate, socketID);
  };

  const handleAddStream = (data: any, socketID: string) => {
    setUsers((prev) => [...prev, { stream: data.stream, socketID }]);
  };

  const leaveCallback = (socketID: string) => {
    peerConnections.current[socketID].close();
    delete peerConnections.current[socketID];
    setUsers((prev) => prev.filter((data) => data.socketID !== socketID));
  };

  useEffect(() => {
    if (!myStream) return;
    console.log("mount");
    socket.emit("join_room", roomIdx);
    socket.on("welcome", welcomeCallback);
    socket.on("offer", offerCallback);
    socket.on("answer", answerCallback);
    socket.on("ice", iceCallback);
    socket.on("leave", leaveCallback);
    return () => {
      setUsers([]);
      peerConnections.current = {};
      console.log("unMount");
      console.log(roomIdx);
      socket.emit("leave_room", roomIdx);
      socket.off("welcome", welcomeCallback);
      socket.off("offer", offerCallback);
      socket.off("answer", answerCallback);
      socket.off("ice", iceCallback);
      socket.off("leave", leaveCallback);
      Object.keys(peerConnections.current).forEach((key) => {
        peerConnections.current[key].close();
      });
    };
  }, [myStream]);

  return users;
};
