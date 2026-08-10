"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckIcon from "@mui/icons-material/Check";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/profileSlice";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriendshipStatus,
  fetchFriendsOfUser,
  removeFriend,
  sendFriendRequest,
} from "@/store/slices/friendsSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import { avatarUrl } from "@/lib/api";

export default function ProfilePage() {
  const params = useParams<{ userId?: string | string[] }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, info } = useNotify();
  const { profile, posts, status } = useAppSelector((s) => s.profile);
  const profileFriends = useAppSelector((s) => s.friends.profileFriends);
  const statusByUserId = useAppSelector((s) => s.friends.statusByUserId);
  const actionStatus = useAppSelector((s) => s.friends.actionStatus);
  const auth = useAppSelector((s) => s.auth);

  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [friendsMenuEl, setFriendsMenuEl] = useState<null | HTMLElement>(null);

  const rawId = params?.userId;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;
  const targetId = userId || auth.currentUser?.userId;
  const isOwnProfile = Boolean(
    targetId && auth.currentUser?.userId && targetId === auth.currentUser.userId
  );
  const friendshipStatus = targetId
    ? statusByUserId[targetId] || "none"
    : "none";

  useEffect(() => {
    if (targetId) {
      dispatch(fetchProfile(String(targetId)));
      dispatch(fetchFriendsOfUser(String(targetId)));
      if (!isOwnProfile && auth.isAuth) {
        dispatch(fetchFriendshipStatus(String(targetId)));
      }
    }
  }, [dispatch, targetId, isOwnProfile, auth.isAuth]);

  const displayName =
    profile?.name || (isOwnProfile ? auth.name : null) || "Profile";
  const bio = profile?.bio?.trim() || "";
  const photo = avatarUrl(profile?.avatar || auth.currentUser?.avatar);
  const friendsCount = profile?.friendsCount ?? profileFriends.length;
  const busy = actionStatus === "loading";

  const onFriendAction = async () => {
    if (!targetId || isOwnProfile) return;

    if (friendshipStatus === "none") {
      const result = await dispatch(sendFriendRequest(targetId));
      if (sendFriendRequest.fulfilled.match(result)) {
        success(result.payload.message || "Friend request sent");
        if (result.payload.status === "friends") {
          dispatch(fetchProfile(targetId));
          dispatch(fetchFriendsOfUser(targetId));
        }
      }
      return;
    }

    if (friendshipStatus === "pending_received") {
      const result = await dispatch(acceptFriendRequest(targetId));
      if (acceptFriendRequest.fulfilled.match(result)) {
        success(result.payload.message || "Friend request accepted");
        dispatch(fetchProfile(targetId));
        dispatch(fetchFriendsOfUser(targetId));
      }
      return;
    }

    if (friendshipStatus === "pending_sent") {
      const result = await dispatch(declineFriendRequest(targetId));
      if (declineFriendRequest.fulfilled.match(result)) {
        success("Friend request cancelled");
      }
    }
  };

  const onUnfriend = async () => {
    setFriendsMenuEl(null);
    if (!targetId) return;
    const result = await dispatch(removeFriend(targetId));
    if (removeFriend.fulfilled.match(result)) {
      success(result.payload.message || "Removed from friends");
      dispatch(fetchProfile(targetId));
      dispatch(fetchFriendsOfUser(targetId));
    }
  };

  const onMessage = () => {
    info("Opening messages");
    router.push("/message");
  };

  const friendButtonLabel =
    friendshipStatus === "friends"
      ? "Friends"
      : friendshipStatus === "pending_sent"
        ? "Cancel request"
        : friendshipStatus === "pending_received"
          ? "Accept"
          : "Add friend";

  const friendButtonIcon =
    friendshipStatus === "friends" ? (
      <CheckIcon />
    ) : friendshipStatus === "pending_sent" ? (
      <HourglassEmptyIcon />
    ) : (
      <PersonAddAlt1Icon />
    );

  return (
    <Box>
      <Box
        sx={{
          height: { xs: 140, md: 180 },
          background: "linear-gradient(135deg, #0f766e, #99f6e4 60%, #e2e8f0)",
        }}
      />

      <Box px={{ xs: 2, md: 3 }} pb={2}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "flex-end" }}
          gap={2}
          mt={{ xs: -7, sm: -8 }}
        >
          <Avatar
            src={photo}
            sx={{
              width: { xs: 112, sm: 128 },
              height: { xs: 112, sm: 128 },
              border: "4px solid #fff",
              fontSize: 42,
              bgcolor: "primary.main",
              boxShadow: "0 8px 24px rgba(15, 118, 110, 0.18)",
            }}
          >
            {displayName.slice(0, 1).toUpperCase()}
          </Avatar>

          <Box
            flex={1}
            minWidth={0}
            textAlign={{ xs: "center", sm: "left" }}
            pb={{ sm: 0.5 }}
          >
            <Typography variant="h4" lineHeight={1.15}>
              {displayName}
            </Typography>
            {bio ? (
              <Typography variant="body1" color="text.secondary" mt={0.75}>
                {bio}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" mt={0.75}>
                {isOwnProfile
                  ? "Add a short bio so people know you"
                  : "No bio yet"}
              </Typography>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              mt={1.75}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
                alignItems: "baseline",
                columnGap: 2,
                rowGap: 0.5,
              }}
            >
              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "text.primary", mr: 0.5 }}
                >
                  {posts.length}
                </Box>
                posts
              </Box>
              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "text.primary", mr: 0.5 }}
                >
                  {friendsCount}
                </Box>
                friends
              </Box>
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexShrink={0}
            pb={{ sm: 0.5 }}
            justifyContent={{ xs: "center", sm: "flex-end" }}
          >
            {isOwnProfile ? (
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setEditOpen(true)}
              >
                Edit profile
              </Button>
            ) : (
              <>
                {friendshipStatus === "friends" ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CheckIcon />}
                      onClick={(e) => setFriendsMenuEl(e.currentTarget)}
                      disabled={busy}
                    >
                      Friends
                    </Button>
                    <Menu
                      anchorEl={friendsMenuEl}
                      open={Boolean(friendsMenuEl)}
                      onClose={() => setFriendsMenuEl(null)}
                    >
                      <MenuItem onClick={onUnfriend}>
                        <PersonRemoveIcon fontSize="small" sx={{ mr: 1 }} />
                        Unfriend
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    variant={
                      friendshipStatus === "pending_sent"
                        ? "outlined"
                        : "contained"
                    }
                    startIcon={friendButtonIcon}
                    onClick={onFriendAction}
                    disabled={busy || !auth.isAuth}
                  >
                    {friendButtonLabel}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={onMessage}
                >
                  Message
                </Button>
              </>
            )}
          </Stack>
        </Box>

        {status === "loading" && (
          <Box mt={2} display="flex" justifyContent="center">
            <CircularProgress size={22} />
          </Box>
        )}
      </Box>

      <Box borderTop="1px solid" borderColor="divider">
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ px: { xs: 1, md: 2 } }}
        >
          <Tab label="Posts" />
          <Tab label={`Friends (${friendsCount})`} />
        </Tabs>

        <Box p={{ xs: 2, md: 2.5 }}>
          {tab === 0 && (
            <Box>
              {[...posts].reverse().map((p) => (
                <Paper
                  key={p.id}
                  variant="outlined"
                  sx={{ p: 1.75, mb: 1.5, borderRadius: 1.5 }}
                >
                  <Box display="flex" gap={1.25} alignItems="flex-start">
                    <Avatar src={photo} sx={{ width: 40, height: 40 }}>
                      {displayName.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{displayName}</Typography>
                      <Typography variant="body1" mt={0.5}>
                        {p.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.like} likes
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
              {posts.length === 0 && (
                <Typography color="text.secondary">No posts yet</Typography>
              )}
            </Box>
          )}

          {tab === 1 && (
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              }}
              gap={1.5}
            >
              {profileFriends.map((f) => (
                <Card
                  key={f._id}
                  component={Link}
                  href={`/profile/${f._id}`}
                  variant="outlined"
                  sx={{
                    borderRadius: 1.5,
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
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
                </Card>
              ))}
              {profileFriends.length === 0 && (
                <Typography color="text.secondary">No friends yet</Typography>
              )}
              {isOwnProfile && (
                <Button
                  component={Link}
                  href="/friends"
                  variant="text"
                  sx={{ justifySelf: "start" }}
                >
                  See all friends
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {isOwnProfile && (
        <EditProfileDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
        />
      )}
    </Box>
  );
}
