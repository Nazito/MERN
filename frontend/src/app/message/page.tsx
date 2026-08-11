"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversations,
  fetchMessages,
  openConversationWithUser,
  sendMessage,
  setActiveConversation,
} from "@/store/slices/messagesSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import { avatarUrl } from "@/lib/api";

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessagesPageInner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error } = useNotify();
  const userIdParam = searchParams.get("userId");
  const chatParam = searchParams.get("chat");

  const messagesState = useAppSelector((s) => s.messages);
  const conversations = messagesState?.conversations ?? [];
  const activeId = messagesState?.activeId ?? null;
  const messages = messagesState?.messages ?? [];
  const listStatus = messagesState?.listStatus ?? "idle";
  const threadStatus = messagesState?.threadStatus ?? "idle";
  const sendStatus = messagesState?.sendStatus ?? "idle";
  const unreadById = messagesState?.unreadById ?? {};
  const myId = useAppSelector((s) => s.auth.currentUser?.userId);
  const isAuth = useAppSelector((s) => s.auth.isAuth);

  const [text, setText] = useState("");
  const [opening, setOpening] = useState(Boolean(userIdParam));
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const openingRef = useRef<string | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeId) || null,
    [conversations, activeId]
  );

  useEffect(() => {
    if (!isAuth) return;
    dispatch(fetchConversations());
  }, [dispatch, isAuth]);

  useEffect(() => {
    if (!isAuth || !userIdParam || userIdParam === myId) {
      setOpening(false);
      return;
    }
    if (openingRef.current === userIdParam) return;
    openingRef.current = userIdParam;
    setOpening(true);

    (async () => {
      const result = await dispatch(openConversationWithUser(userIdParam));
      if (openConversationWithUser.fulfilled.match(result)) {
        const chatId = result.payload._id;
        await dispatch(fetchMessages(chatId));
        await dispatch(fetchConversations());
        router.replace(`/message?chat=${chatId}`);
      } else {
        error("Could not open chat");
        openingRef.current = null;
        router.replace("/message");
      }
      setOpening(false);
    })();
  }, [dispatch, isAuth, userIdParam, myId, router, error]);

  useEffect(() => {
    if (!chatParam || userIdParam) return;
    if (activeId === chatParam) return;
    dispatch(setActiveConversation(chatParam));
    dispatch(fetchMessages(chatParam));
  }, [chatParam, userIdParam, activeId, dispatch]);

  useEffect(() => {
    if (activeId || userIdParam || chatParam || opening) return;
    if (listStatus !== "succeeded" || conversations.length === 0) return;
    const firstId = conversations[0]._id;
    dispatch(setActiveConversation(firstId));
    dispatch(fetchMessages(firstId));
    router.replace(`/message?chat=${firstId}`);
  }, [
    activeId,
    userIdParam,
    chatParam,
    opening,
    listStatus,
    conversations,
    dispatch,
    router,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  const onSelectConversation = (id: string) => {
    dispatch(setActiveConversation(id));
    dispatch(fetchMessages(id));
    router.replace(`/message?chat=${id}`);
  };

  const onSend = async () => {
    const value = text.trim();
    if (!value || !activeId) return;
    setText("");
    await dispatch(sendMessage({ conversationId: activeId, text: value }));
  };

  const peerName = activeConversation?.peer?.name || "Conversation";
  const peerBio = activeConversation?.peer?.bio?.trim() || "Direct message";
  const peerAvatar = avatarUrl(activeConversation?.peer?.avatar);
  const showThread = Boolean(activeId);

  if (!isAuth) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Messages
        </Typography>
        <Typography color="text.secondary">
          Log in to chat with people in Circle.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "280px 1fr" }}
      sx={{
        height: "100%",
        minHeight: 0,
        flex: 1,
      }}
    >
      <Box
        sx={{
          borderRight: { md: "1px solid" },
          borderColor: "divider",
          bgcolor: "grey.50",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Inbox
        </Typography>
        <Typography variant="h5" gutterBottom>
          Messages
        </Typography>

        {listStatus === "loading" && conversations.length === 0 ? (
          <Box py={4} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        ) : conversations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No chats yet. Open Friends and press Message.
          </Typography>
        ) : (
          <List disablePadding>
            {conversations.map((c) => {
              const name = c.peer?.name || "Member";
              const selected = c._id === activeId;
              const unread = unreadById[c._id] || 0;
              return (
                <ListItemButton
                  key={c._id}
                  selected={selected}
                  onClick={() => onSelectConversation(c._id)}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { bgcolor: "primary.dark" },
                      "& .MuiListItemText-secondary": {
                        color: "rgba(255,255,255,0.8)",
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      badgeContent={unread}
                      max={9}
                      invisible={!unread || selected}
                      overlap="circular"
                    >
                      <Avatar
                        src={avatarUrl(c.peer?.avatar)}
                        sx={{
                          bgcolor: selected ? "primary.dark" : "primary.main",
                        }}
                      >
                        {name.slice(0, 1).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={c.lastMessage || "Start chatting"}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: unread && !selected ? 700 : 600,
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontWeight: unread && !selected ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        minWidth={0}
        height="100%"
        overflow="hidden"
      >
        {opening && !activeId ? (
          <Box flex={1} display="grid" sx={{ placeItems: "center" }}>
            <CircularProgress size={28} />
          </Box>
        ) : showThread ? (
          <>
            <Box p={2} display="flex" alignItems="center" gap={1.25} flexShrink={0}>
              <Avatar src={peerAvatar} sx={{ bgcolor: "primary.main" }}>
                {peerName.slice(0, 1).toUpperCase()}
              </Avatar>
              <Box minWidth={0}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {peerName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {peerBio}
                </Typography>
              </Box>
            </Box>
            <Divider />

            <Box
              flex={1}
              minHeight={0}
              p={2}
              display="flex"
              flexDirection="column"
              gap={1.25}
              sx={{
                overflowY: "auto",
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f7faf9 100%)",
              }}
            >
              {threadStatus === "loading" ? (
                <Box py={6} display="flex" justifyContent="center">
                  <CircularProgress size={24} />
                </Box>
              ) : messages.length === 0 ? (
                <Typography color="text.secondary" align="center" py={4}>
                  Say hello — send the first message.
                </Typography>
              ) : (
                messages.map((m) => (
                  <Box
                    key={m._id}
                    display="flex"
                    justifyContent={m.mine ? "flex-end" : "flex-start"}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        maxWidth: "75%",
                        width: "fit-content",
                        p: 1.5,
                        borderRadius: m.mine
                          ? "10px 10px 4px 10px"
                          : "10px 10px 10px 4px",
                        bgcolor: m.mine ? "primary.main" : "#e7f6f2",
                        color: m.mine ? "primary.contrastText" : "text.primary",
                      }}
                    >
                      <Typography variant="body2">{m.text}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          opacity: 0.75,
                          textAlign: "right",
                        }}
                      >
                        {formatTime(m.createdAt)}
                      </Typography>
                    </Paper>
                  </Box>
                ))
              )}
              <div ref={bottomRef} />
            </Box>

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                onSend();
              }}
              p={1.75}
              borderTop="1px solid"
              borderColor="divider"
              display="grid"
              gridTemplateColumns="1fr auto"
              gap={1.25}
              bgcolor="background.paper"
              flexShrink={0}
              zIndex={1}
            >
              <TextField
                size="small"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!text.trim() || sendStatus === "loading" || !activeId}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            flex={1}
            display="grid"
            sx={{ placeItems: "center", p: 3, color: "text.secondary" }}
          >
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Select a chat
              </Typography>
              <Typography variant="body2">
                Go to Friends and press Message on a person.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <Box py={8} display="flex" justifyContent="center">
          <CircularProgress size={28} />
        </Box>
      }
    >
      <MessagesPageInner />
    </Suspense>
  );
}
