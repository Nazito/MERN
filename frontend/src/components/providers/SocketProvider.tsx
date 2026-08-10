"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchFriendRequests,
  fetchFriends,
  FriendRequest,
  receiveFriendRequest,
} from "@/store/slices/friendsSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";

function normalizeRequest(payload: FriendRequest): FriendRequest | null {
  if (!payload?.from?._id) return null;
  return {
    _id: String(payload._id ?? `${payload.from._id}-${Date.now()}`),
    createdAt: payload.createdAt,
    from: {
      _id: String(payload.from._id),
      name: payload.from.name,
      avatar: payload.from.avatar,
      bio: payload.from.bio,
      email: payload.from.email,
    },
  };
}

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const { info, success } = useNotify();
  const infoRef = useRef(info);
  const successRef = useRef(success);

  useEffect(() => {
    infoRef.current = info;
    successRef.current = success;
  }, [info, success]);

  useEffect(() => {
    if (!isAuth) {
      disconnectSocket();
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const socket = connectSocket(token);

    const onFriendRequest = (raw: FriendRequest) => {
      const payload = normalizeRequest(raw);
      if (!payload) {
        dispatch(fetchFriendRequests());
        return;
      }
      dispatch(receiveFriendRequest(payload));
      dispatch(fetchFriendRequests());
      infoRef.current(
        `${payload.from.name || "Someone"} sent you a friend request`
      );
    };

    const onFriendAccepted = (payload: { by?: { name?: string } }) => {
      successRef.current(
        `${payload?.by?.name || "Someone"} accepted your friend request`
      );
      dispatch(fetchFriends());
    };

    socket.on("friend:request", onFriendRequest);
    socket.on("friend:accepted", onFriendAccepted);

    return () => {
      const active = getSocket();
      active?.off("friend:request", onFriendRequest);
      active?.off("friend:accepted", onFriendAccepted);
      disconnectSocket();
    };
  }, [isAuth, dispatch]);

  return <>{children}</>;
}
