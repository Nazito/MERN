"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPost, fetchFeed } from "@/store/slices/postsSlice";
import { avatarUrl } from "@/lib/api";
import PostCard from "@/components/posts/PostCard";

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const name = useAppSelector((s) => s.auth.name);
  const avatar = useAppSelector((s) => s.auth.currentUser?.avatar);
  const feed = useAppSelector((s) => s.posts.feed);
  const feedStatus = useAppSelector((s) => s.posts.feedStatus);
  const createStatus = useAppSelector((s) => s.posts.createStatus);
  const [text, setText] = useState("");

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFeed());
    }
  }, [dispatch, isAuth]);

  const onPublish = async () => {
    const value = text.trim();
    if (!value || !isAuth) return;
    const result = await dispatch(createPost(value));
    if (createPost.fulfilled.match(result)) {
      setText("");
    }
  };

  return (
    <Box p={3}>
      <Box mb={2.5}>
        <Typography variant="overline" color="text.secondary">
          Home
        </Typography>
        <Typography variant="h4">Feed</Typography>
        <Typography variant="body2" color="text.secondary">
          What is new with people in your circle
        </Typography>
      </Box>

      {isAuth ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
          }}
        >
          <Box display="flex" gap={1.5} alignItems="flex-start">
            <Avatar src={avatarUrl(avatar)} sx={{ mt: 0.5, bgcolor: "primary.main" }}>
              {(name || "U").slice(0, 1).toUpperCase()}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="What is on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                inputProps={{ maxLength: 2000 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: 1.5,
                  },
                }}
              />
              <Box mt={1.5} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={onPublish}
                  disabled={!text.trim() || createStatus === "loading"}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{ p: 2.5, mb: 2, borderRadius: 2, textAlign: "center" }}
        >
          <Typography variant="body1" gutterBottom>
            Log in to see your circle feed and publish posts.
          </Typography>
          <Button component={Link} href="/login" variant="contained">
            Log in
          </Button>
        </Paper>
      )}

      {isAuth && feedStatus === "loading" && feed.length === 0 ? (
        <Box py={6} display="flex" justifyContent="center">
          <CircularProgress size={28} />
        </Box>
      ) : isAuth && feed.length === 0 && feedStatus === "succeeded" ? (
        <Typography color="text.secondary" py={3}>
          No posts yet. Write the first one or add friends to fill the feed.
        </Typography>
      ) : (
        <Box display="grid" gap={1.75}>
          {feed.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}
    </Box>
  );
}
