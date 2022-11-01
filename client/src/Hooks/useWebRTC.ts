import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MyStream } from "store";
import { useSocket } from "./useSocket";

// const myPeerConnection = new RTCPeerConnection();

const urls = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:stun2.l.google.com:19302",
  "stun:stun3.l.google.com:19302",
  "stun:stun4.l.google.com:19302",
];

export const useWebRTC = (otherUserVideoRef: React.RefObject<HTMLVideoElement>) => {
  const { roomIdx } = useParams();

  const [socket, _] = useSocket();
  const myPeerConnection = useRef<RTCPeerConnection>(new RTCPeerConnection({ iceServers: [{ urls }] }));
  const [isFirst, setIsFirst] = useState(true);
  const myStream = useRecoilValue(MyStream);

  const welcomeCallback = useCallback(async () => {
    console.log("welcomeCallback");
    const offer = await myPeerConnection.current.createOffer();
    myPeerConnection.current.setLocalDescription(offer);
    socket.emit("offer", offer, roomIdx);
  }, []);

  const offerCallback = useCallback(async (offer: RTCSessionDescriptionInit) => {
    console.log("offerCallback");
    myPeerConnection.current.setRemoteDescription(offer);
    const answer = await myPeerConnection.current.createAnswer();
    myPeerConnection.current.setLocalDescription(answer);
    socket.emit("answer", answer, roomIdx);
  }, []);

  const answerCallback = useCallback((answer: RTCSessionDescriptionInit) => {
    console.log("answerCallback");
    console.log(answer);
    myPeerConnection.current.setRemoteDescription(answer);
  }, []);

  const iceCallback = useCallback((ice: RTCIceCandidateInit) => {
    console.log("iceCallback");
    myPeerConnection.current.addIceCandidate(ice);
  }, []);

  const handleIce = useCallback((data: any) => {
    console.log("handleIce");
    socket.emit("ice", data.candidate, roomIdx);
  }, []);

  const handleAddStream = useCallback((data: any) => {
    console.log("handleAddStream");
    if (!otherUserVideoRef.current) return;
    otherUserVideoRef.current.srcObject = data.stream;
  }, []);

  const leaveCallback = useCallback(() => {
    console.log("leaveCallback");
    if (!otherUserVideoRef.current) return;
    otherUserVideoRef.current.srcObject = null;
    //myPeerConnection.current = new RTCPeerConnection({ iceServers: [{ urls }] });
  }, []);

  useEffect(() => {
    if (myStream && isFirst) {
      console.log(myPeerConnection);
      myStream.getTracks().forEach((track) => myPeerConnection.current.addTrack(track, myStream));
      setIsFirst(false);
    }
  }, [myStream, isFirst]);

  useEffect(() => {
    socket.emit("join_room", roomIdx);
    socket.on("welcome", welcomeCallback);
    socket.on("offer", offerCallback);
    socket.on("answer", answerCallback);
    socket.on("ice", iceCallback);
    socket.on("leave", leaveCallback);
    myPeerConnection.current.addEventListener("icecandidate", handleIce);
    myPeerConnection.current.addEventListener("addstream", handleAddStream);
    return () => {
      socket.emit("leave_room", roomIdx);
      socket.off("welcome", welcomeCallback);
      socket.off("offer", offerCallback);
      socket.off("answer", answerCallback);
      socket.off("ice", iceCallback);
      socket.off("leave", leaveCallback);
      myPeerConnection.current.removeEventListener("icecandidate", handleIce);
      myPeerConnection.current.removeEventListener("addstream", handleAddStream);
      myPeerConnection.current.close();
    };
  }, []);
};
