"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPost, fetchProfile } from "@/store/slices/profileSlice";

export default function ProfilePage() {
  const params = useParams<{ userId?: string | string[] }>();
  const dispatch = useAppDispatch();
  const { profile, posts, status } = useAppSelector((s) => s.profile);
  const auth = useAppSelector((s) => s.auth);
  const [text, setText] = useState("");

  const rawId = params?.userId;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;
  const targetId = userId || auth.currentUser?.userId;

  useEffect(() => {
    if (targetId) {
      dispatch(fetchProfile(String(targetId)));
    }
  }, [dispatch, targetId]);

  const onPublish = () => {
    const value = text.trim();
    if (!value) return;
    dispatch(addPost(value));
    setText("");
  };

  return (
    <Box>
      <Box
        sx={{
          height: 180,
          background: "linear-gradient(135deg, #0f766e, #99f6e4 60%, #e2e8f0)",
        }}
      />
      <Box textAlign="center" mt={-8} pb={2}>
        <Avatar
          sx={{
            width: 128,
            height: 128,
            mx: "auto",
            border: "4px solid #fff",
            fontSize: 42,
            bgcolor: "primary.main",
          }}
        >
          {(profile?.name || auth.name || "U").slice(0, 1).toUpperCase()}
        </Avatar>
        <Typography variant="h4" mt={1.5}>
          {profile?.name || auth.name || "Profile"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile?.email || "Your Circle profile"}
        </Typography>
        {status === "loading" && (
          <Box mt={2}>
            <CircularProgress size={22} />
          </Box>
        )}
      </Box>

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

        {[...posts].reverse().map((p) => (
          <Paper key={p.id} variant="outlined" sx={{ p: 1.75, mb: 1.5, borderRadius: 3 }}>
            <Typography variant="body1">{p.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {p.like} likes
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
