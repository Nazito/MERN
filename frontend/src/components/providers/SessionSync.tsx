"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateFromSession } from "@/store/slices/authSlice";
import { fetchFriendRequests } from "@/store/slices/friendsSlice";
import { fetchConversations } from "@/store/slices/messagesSlice";
import { setAccessTokenCache } from "@/lib/sessionToken";

/**
 * Bridges NextAuth session → Redux auth + access token cache for axios/socket.
 */
export default function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const loadedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user) {
      setAccessTokenCache(null);
      dispatch(hydrateFromSession(null));
      loadedForUser.current = null;
      return;
    }

    const userId = session.user.userId || session.user.id;
    setAccessTokenCache(session.accessToken ?? null);
    dispatch(
      hydrateFromSession({
        userId,
        name: session.user.name || undefined,
        avatar: session.user.avatar || undefined,
      })
    );

    if (loadedForUser.current === userId) return;
    loadedForUser.current = userId;
    dispatch(fetchFriendRequests());
    dispatch(fetchConversations());
  }, [session, status, dispatch]);

  return null;
}
