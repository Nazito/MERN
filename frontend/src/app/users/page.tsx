"use client";

import { useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckIcon from "@mui/icons-material/Check";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers } from "@/store/slices/usersSlice";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriendshipStatus,
  sendFriendRequest,
} from "@/store/slices/friendsSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import { avatarUrl } from "@/lib/api";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { success } = useNotify();
  const { users, status } = useAppSelector((s) => s.users);
  const currentUserId = useAppSelector((s) => s.auth.currentUser?.userId);
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const statusByUserId = useAppSelector((s) => s.friends.statusByUserId);
  const actionStatus = useAppSelector((s) => s.friends.actionStatus);
  const busy = actionStatus === "loading";

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuth || users.length === 0) return;
    users.forEach((user) => {
      if (user._id !== currentUserId) {
        dispatch(fetchFriendshipStatus(user._id));
      }
    });
  }, [dispatch, users, currentUserId, isAuth]);

  const onFriendClick = async (userId: string) => {
    const friendship = statusByUserId[userId] || "none";

    if (friendship === "none") {
      const result = await dispatch(sendFriendRequest(userId));
      if (sendFriendRequest.fulfilled.match(result)) {
        success(result.payload.message || "Friend request sent");
      }
      return;
    }

    if (friendship === "pending_received") {
      const result = await dispatch(acceptFriendRequest(userId));
      if (acceptFriendRequest.fulfilled.match(result)) {
        success(result.payload.message || "Accepted");
      }
      return;
    }

    if (friendship === "pending_sent") {
      const result = await dispatch(declineFriendRequest(userId));
      if (declineFriendRequest.fulfilled.match(result)) {
        success("Request cancelled");
      }
    }
  };

  const people = users.filter((u) => u._id !== currentUserId);

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={2.5}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Discover
          </Typography>
          <Typography variant="h4">People</Typography>
          <Typography variant="body2" color="text.secondary">
            Find new friends in Circle
          </Typography>
        </Box>
        <Chip
          label={`${people.length} people`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {status === "loading" ? (
        <Box display="grid" sx={{ placeItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        >
          {people.map((user) => {
            const initial = (user.name || user.email || "?")
              .slice(0, 1)
              .toUpperCase();
            const friendship = statusByUserId[user._id] || "none";
            const label =
              friendship === "friends"
                ? "Friends"
                : friendship === "pending_sent"
                  ? "Cancel request"
                  : friendship === "pending_received"
                    ? "Accept"
                    : "Add friend";
            const icon =
              friendship === "friends" ? (
                <CheckIcon fontSize="small" />
              ) : friendship === "pending_sent" ? (
                <HourglassEmptyIcon fontSize="small" />
              ) : (
                <PersonAddAlt1Icon fontSize="small" />
              );

            return (
              <Card key={user._id} variant="outlined" sx={{ borderRadius: 1.5 }}>
                <Box
                  sx={{
                    height: 96,
                    background:
                      "linear-gradient(135deg, rgba(45,212,191,0.35), #e7eef7)",
                  }}
                />
                <CardHeader
                  avatar={
                    <Avatar
                      src={avatarUrl(user.avatar)}
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {initial}
                    </Avatar>
                  }
                  title={user.name || "No name"}
                  subheader={user.email}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {user.bio?.trim() ||
                      "Circle member. Open the profile to see more details."}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    href={`/profile/${user._id}`}
                  >
                    Profile
                  </Button>
                  <Button
                    size="small"
                    startIcon={icon}
                    disabled={
                      !isAuth || busy || friendship === "friends"
                    }
                    onClick={() => onFriendClick(user._id)}
                  >
                    {label}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
