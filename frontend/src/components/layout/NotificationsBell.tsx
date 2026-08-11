"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriends,
} from "@/store/slices/friendsSlice";
import { selectUnreadTotal } from "@/store/slices/messagesSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import { avatarUrl } from "@/lib/api";

export default function NotificationsBell() {
  const dispatch = useAppDispatch();
  const { success } = useNotify();
  const requests = useAppSelector((s) => s.friends.requests);
  const conversations = useAppSelector((s) => s.messages.conversations);
  const unreadById = useAppSelector((s) => s.messages.unreadById || {});
  const unreadMessages = useAppSelector(selectUnreadTotal);
  const busy = useAppSelector((s) => s.friends.actionStatus) === "loading";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const unreadChats = useMemo(
    () =>
      conversations.filter((c) => (unreadById[c._id] || 0) > 0).slice(0, 5),
    [conversations, unreadById]
  );

  const badgeTotal = requests.length + unreadMessages;

  const onAccept = async (userId: string) => {
    const result = await dispatch(acceptFriendRequest(userId));
    if (acceptFriendRequest.fulfilled.match(result)) {
      success(result.payload.message || "Accepted");
      dispatch(fetchFriends());
    }
  };

  const onDecline = async (userId: string) => {
    const result = await dispatch(declineFriendRequest(userId));
    if (declineFriendRequest.fulfilled.match(result)) {
      success("Request declined");
    }
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="Notifications"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          border: "1px solid",
          borderColor: open ? "primary.main" : "divider",
          borderRadius: 1.5,
          overflow: "visible",
          bgcolor: open ? "action.hover" : "transparent",
        }}
      >
        <Badge
          badgeContent={badgeTotal}
          color="error"
          max={9}
          overlap="circular"
          invisible={badgeTotal === 0}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: 10,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              top: -2,
              right: -4,
            },
          }}
        >
          <NotificationsNoneIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            width: 340,
            maxWidth: "calc(100vw - 32px)",
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 32px rgba(21, 32, 43, 0.12)",
          },
        }}
      >
        <Box px={2} py={1.25}>
          <Typography variant="subtitle2">Notifications</Typography>
          <Typography variant="caption" color="text.secondary">
            Messages and friend requests
          </Typography>
        </Box>
        <Divider />

        {unreadChats.length > 0 && (
          <Box>
            <Box px={2} pt={1.25} pb={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Messages
              </Typography>
            </Box>
            {unreadChats.map((chat) => {
              const count = unreadById[chat._id] || 0;
              const name = chat.peer?.name || "Member";
              return (
                <MenuItem
                  key={chat._id}
                  component={Link}
                  href={`/message?chat=${chat._id}`}
                  onClick={() => setAnchorEl(null)}
                  sx={{ alignItems: "flex-start", py: 1.25, gap: 1.25 }}
                >
                  <Avatar
                    src={avatarUrl(chat.peer?.avatar)}
                    sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
                  >
                    {name.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box minWidth={0} flex={1}>
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {count} new · {chat.lastMessage || "New message"}
                    </Typography>
                  </Box>
                </MenuItem>
              );
            })}
            <Divider />
          </Box>
        )}

        <Box px={2} pt={1.25} pb={0.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            Friend requests
          </Typography>
        </Box>

        {requests.length === 0 ? (
          <Box px={2} py={2}>
            <Typography variant="body2" color="text.secondary">
              {unreadChats.length === 0
                ? "No new notifications"
                : "No new friend requests"}
            </Typography>
          </Box>
        ) : (
          requests.map((req) => (
            <Box key={req._id} px={2} py={1.25}>
              <Box display="flex" gap={1.25} alignItems="flex-start">
                <Avatar
                  src={avatarUrl(req.from.avatar)}
                  sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                >
                  {(req.from.name || "?").slice(0, 1)}
                </Avatar>
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {req.from.name || "Member"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    wants to be friends
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={busy}
                      onClick={() => onAccept(req.from._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      color="inherit"
                      disabled={busy}
                      onClick={() => onDecline(req.from._id)}
                    >
                      Decline
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}

        <Divider />
        <MenuItem
          component={Link}
          href="/message"
          onClick={() => setAnchorEl(null)}
          sx={{ justifyContent: "center", py: 1.25 }}
        >
          <Typography variant="body2" color="primary">
            Open messages
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
