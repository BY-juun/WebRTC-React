import { atom } from "recoil";

export const OpenItemModal = atom<boolean>({
  key: "OpenItemModal",
  default: false,
});

export const OpenChatModal = atom<boolean>({
  key: "OpenChatModal",
  default: false,
});

export const MyStream = atom<MediaStream | null>({
  key: "MyStream",
  default: null,
});

export const MuteOn = atom<boolean>({
  key: "Mute",
  default: false,
});

export const CameraOn = atom<boolean>({
  key: "CameraOn",
  default: true,
});
