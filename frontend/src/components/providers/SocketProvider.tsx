"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchFriendRequests,
  fetchFriends,
  FriendRequest,
  receiveFriendRequest,
} from "@/store/slices/friendsSlice";
import {
  Conversation,
  ChatMessage,
  receiveMessage,
  resetMessagesState,
  setActiveConversation,
  fetchConversations,
} from "@/store/slices/messagesSlice";
import { notifyFromServer } from "@/lib/notificationBus";
import {
  connectSocket,
  disconnectSocket,
  subscribeSocket,
} from "@/lib/socket";
import {
  getAccessTokenCache,
  setAccessTokenCache,
} from "@/lib/sessionToken";

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
  const { data: session, status: sessionStatus } = useSession();
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const activeId = useAppSelector((s) => s.messages?.activeId ?? null);
  const pathname = usePathname();
  const accessToken =
    session?.accessToken || getAccessTokenCache() || null;

  const activeIdRef = useRef(activeId);
  const pathnameRef = useRef(pathname);
  const seenMessageIds = useRef(new Set<string>());

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Leaving Messages should drop "viewing" state so unread works on other pages
  useEffect(() => {
    if (!pathname?.startsWith("/message") && activeId) {
      dispatch(setActiveConversation(null));
    }
  }, [pathname, activeId, dispatch]);

  const unreadTotal = useAppSelector((s) => {
    const map = s.messages?.unreadById || {};
    return Object.values(map).reduce((sum, n) => sum + (n || 0), 0);
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const base = "Circle";
    document.title = unreadTotal > 0 ? `(${unreadTotal}) ${base}` : base;
  }, [unreadTotal]);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (!isAuth || sessionStatus !== "authenticated" || !accessToken) {
      disconnectSocket();
      if (!isAuth || sessionStatus === "unauthenticated") {
        dispatch(resetMessagesState());
        seenMessageIds.current.clear();
        setAccessTokenCache(null);
      }
      return;
    }

    setAccessTokenCache(accessToken);
    connectSocket(accessToken);

    const onEvent = (event: string, raw: unknown) => {
      if (event === "friend:request") {
        const payload = normalizeRequest(raw as FriendRequest);
        if (!payload) {
          dispatch(fetchFriendRequests());
          return;
        }
        dispatch(receiveFriendRequest(payload));
        dispatch(fetchFriendRequests());
        notifyFromServer({
          message: `${payload.from.name || "Someone"} sent you a friend request`,
          severity: "info",
        });
        return;
      }

      if (event === "friend:accepted") {
        const payload = raw as { by?: { name?: string } };
        notifyFromServer({
          message: `${payload?.by?.name || "Someone"} accepted your friend request`,
          severity: "success",
        });
        dispatch(fetchFriends());
        return;
      }

      if (event === "message:new") {
        const payload = raw as {
          _id: string;
          conversationId: string;
          text: string;
          senderId: string;
          sender?: ChatMessage["sender"];
          createdAt?: string;
          conversation?: Conversation;
        };

        const messageId = String(payload._id);
        if (seenMessageIds.current.has(messageId)) return;
        seenMessageIds.current.add(messageId);

        const conversationId = String(payload.conversationId);
        const onMessagesPage = Boolean(
          pathnameRef.current?.startsWith("/message")
        );
        const viewingThisChat =
          onMessagesPage && activeIdRef.current === conversationId;

        dispatch(
          receiveMessage({
            message: {
              _id: messageId,
              conversationId,
              text: payload.text,
              senderId: String(payload.senderId),
              sender: payload.sender || null,
              createdAt: payload.createdAt,
              mine: false,
            },
            conversation: payload.conversation,
            viewing: viewingThisChat,
          })
        );

        if (!viewingThisChat) {
          const name = payload.sender?.name || "Someone";
          const preview =
            payload.text.length > 80
              ? `${payload.text.slice(0, 80)}…`
              : payload.text;
          notifyFromServer({
            message: `${name}: ${preview}`,
            severity: "info",
            duration: 5000,
          });
        }
      }
    };

    const unsubscribe = subscribeSocket(onEvent);

    const pollId = window.setInterval(() => {
      dispatch(fetchConversations());
    }, 15000);

    return () => {
      unsubscribe();
      window.clearInterval(pollId);
    };
  }, [isAuth, accessToken, sessionStatus, dispatch]);

  return <>{children}</>;
}
