"use client";

import { useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  removeFriend,
} from "@/store/slices/friendsSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import { avatarUrl } from "@/lib/api";

export default function FriendsPage() {
  const dispatch = useAppDispatch();
  const { success } = useNotify();
  const { friends, requests, status, requestsStatus, actionStatus } =
    useAppSelector((s) => s.friends);
  const busy = actionStatus === "loading";

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

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

  const onRemove = async (userId: string) => {
    const result = await dispatch(removeFriend(userId));
    if (removeFriend.fulfilled.match(result)) {
      success(result.payload.message || "Removed");
    }
  };

  const loading = status === "loading" || requestsStatus === "loading";

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
            People
          </Typography>
          <Typography variant="h4">Friends</Typography>
          <Typography variant="body2" color="text.secondary">
            Your friends and incoming requests
          </Typography>
        </Box>
        <Chip
          label={`${friends.length} friends`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {loading ? (
        <Box display="grid" sx={{ placeItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: requests.length ? "rgba(15, 118, 110, 0.04)" : "grey.50",
              borderColor: requests.length ? "primary.light" : "divider",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={requests.length ? 1.5 : 0}
              gap={1}
            >
              <Box>
                <Typography variant="h6">Friend requests</Typography>
                <Typography variant="body2" color="text.secondary">
                  People who want to connect with you
                </Typography>
              </Box>
              <Chip
                size="small"
                color={requests.length ? "primary" : "default"}
                label={`${requests.length} pending`}
              />
            </Box>

            {requests.length === 0 ? (
              <Typography variant="body2" color="text.secondary" mt={1}>
                No pending requests right now.
              </Typography>
            ) : (
              <Box
                display="grid"
                gap={1.5}
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr",
                }}
              >
                {requests.map((req) => {
                  const from = req.from;
                  return (
                    <Card
                      key={req._id}
                      variant="outlined"
                      sx={{ borderRadius: 1.5, bgcolor: "background.paper" }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            src={avatarUrl(from.avatar)}
                            sx={{ bgcolor: "primary.main" }}
                          >
                            {(from.name || "?").slice(0, 1)}
                          </Avatar>
                        }
                        title={from.name || "Member"}
                        subheader={from.bio?.trim() || "Wants to be friends"}
                      />
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          disabled={busy}
                          onClick={() => onAccept(from._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          color="inherit"
                          disabled={busy}
                          onClick={() => onDecline(from._id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="small"
                          component={Link}
                          href={`/profile/${from._id}`}
                        >
                          Profile
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Paper>

          <Box>
            <Typography variant="h6" gutterBottom>
              Your friends
            </Typography>
            {friends.length === 0 ? (
              <Typography color="text.secondary">
                No friends yet. Find people and send a request.
              </Typography>
            ) : (
              <Box
                display="grid"
                gap={2}
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                }}
              >
                {friends.map((f) => (
                  <Card key={f._id} variant="outlined" sx={{ borderRadius: 1.5 }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          src={avatarUrl(f.avatar)}
                          sx={{ bgcolor: "primary.main" }}
                        >
                          {(f.name || "?").slice(0, 1)}
                        </Avatar>
                      }
                      title={f.name || "Member"}
                      subheader={f.bio?.trim() || "Friend"}
                    />
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        href={`/profile/${f._id}`}
                      >
                        Profile
                      </Button>
                      <Button
                        size="small"
                        color="inherit"
                        disabled={busy}
                        onClick={() => onRemove(f._id)}
                      >
                        Unfriend
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
