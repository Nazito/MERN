"use client";

<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
=======
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
>>>>>>> Stashed changes
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
<<<<<<< Updated upstream
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
=======
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
>>>>>>> Stashed changes
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckIcon from "@mui/icons-material/Check";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
<<<<<<< Updated upstream
import { addPost, fetchProfile } from "@/store/slices/profileSlice";
=======
import { fetchProfile } from "@/store/slices/profileSlice";
import { addFriend } from "@/store/slices/friendsSlice";
import { useNotify } from "@/components/providers/NotificationProvider";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import { avatarUrl } from "@/lib/api";
>>>>>>> Stashed changes

export default function ProfilePage() {
  const params = useParams<{ userId?: string | string[] }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, info } = useNotify();
  const { profile, posts, status } = useAppSelector((s) => s.profile);
  const friends = useAppSelector((s) => s.friends.friends);
  const auth = useAppSelector((s) => s.auth);
  const [text, setText] = useState("");

  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  const rawId = params?.userId;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;
  const targetId = userId || auth.currentUser?.userId;
  const isOwnProfile = Boolean(
    targetId && auth.currentUser?.userId && targetId === auth.currentUser.userId
  );

  useEffect(() => {
    if (targetId) {
      dispatch(fetchProfile(String(targetId)));
    }
  }, [dispatch, targetId]);

<<<<<<< Updated upstream
  const onPublish = () => {
    const value = text.trim();
    if (!value) return;
    dispatch(addPost(value));
    setText("");
=======
  const displayName = profile?.name || (isOwnProfile ? auth.name : null) || "Profile";
  const bio = profile?.bio?.trim() || "";
  const photo = avatarUrl(profile?.avatar || auth.currentUser?.avatar);

  const isFriend = useMemo(() => {
    return friends.some(
      (f) => f.name.toLowerCase() === displayName.toLowerCase()
    );
  }, [friends, displayName]);

  const onAddFriend = () => {
    if (!displayName || displayName === "Profile") return;
    dispatch(addFriend({ name: displayName, ava: profile?.avatar || "" }));
    success(`Added ${displayName} as a friend`);
  };

  const onMessage = () => {
    info("Opening messages");
    router.push("/message");
>>>>>>> Stashed changes
  };

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
                  {friends.length}
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
                <Button
                  variant={isFriend ? "outlined" : "contained"}
                  startIcon={isFriend ? <CheckIcon /> : <PersonAddAlt1Icon />}
                  onClick={onAddFriend}
                  disabled={isFriend}
                >
                  {isFriend ? "Friends" : "Add friend"}
                </Button>
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

<<<<<<< Updated upstream
      <Box p={2.5} borderTop="1px solid" borderColor="divider">
        <Typography variant="h5" gutterBottom>
          Posts
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="What is on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Box mt={1.5}>
            <Button variant="contained" onClick={onPublish}>
              Publish
            </Button>
          </Box>
        </Paper>
=======
      <Box borderTop="1px solid" borderColor="divider">
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{ px: { xs: 1, md: 2 } }}
        >
          <Tab label="Posts" />
          <Tab label="Friends" />
        </Tabs>
>>>>>>> Stashed changes

        <Box p={{ xs: 2, md: 2.5 }}>
          {tab === 0 && (
            <Box>
              {[...posts].reverse().map((p) => (
                <Paper
                  key={p.id}
                  variant="outlined"
                  sx={{ p: 1.75, mb: 1.5, borderRadius: 3 }}
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
              {friends.map((f) => (
                <Card key={f.name} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {f.name.slice(0, 1)}
                      </Avatar>
                    }
                    title={f.name}
                    subheader="Friend"
                  />
                </Card>
              ))}
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
