"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ShareIcon from "@mui/icons-material/Share";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPost } from "@/store/slices/profileSlice";

const demoFeed = [
  {
    id: "demo-1",
    author: "Maria K.",
    initials: "MK",
    time: "12 min",
    text: "Built a calm evening playlist. Anyone else listening to something soft after work?",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: "demo-2",
    author: "Ilya R.",
    initials: "IR",
    time: "1 h",
    text: "Uploaded new trip photos. The weather was perfect — almost postcard material.",
    likes: 61,
    comments: 14,
    shares: 11,
  },
  {
    id: "demo-3",
    author: "Circle Team",
    initials: "CT",
    time: "yesterday",
    text: "Welcome to Circle. Feed, friends and messages are here — more features coming soon.",
    likes: 128,
    comments: 42,
    shares: 19,
  },
];

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((s) => s.auth);
  const posts = useAppSelector((s) => s.profile.posts);
  const [text, setText] = useState("");

  const onPublish = () => {
    const value = text.trim();
    if (!value) return;
    dispatch(addPost(value));
    setText("");
  };

  const ownPosts = [...posts]
    .reverse()
    .map((p) => ({
      id: `own-${p.id}`,
      author: name || "You",
      initials: (name || "Y").slice(0, 1).toUpperCase(),
      time: "just now",
      text: p.message,
      likes: p.like,
      comments: 0,
      shares: 0,
    }));

  const feed = [...ownPosts, ...demoFeed];

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
          <Avatar sx={{ mt: 0.5 }}>
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
                disabled={!text.trim()}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box display="grid" gap={1.75}>
        {feed.map((item) => (
          <Card key={item.id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardHeader
              avatar={<Avatar>{item.initials}</Avatar>}
              title={item.author}
              subheader={item.time}
            />
            <CardContent>
              <Typography variant="body1">{item.text}</Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button size="small" startIcon={<FavoriteIcon />}>
                {item.likes}
              </Button>
              <Button size="small" startIcon={<ChatBubbleIcon />}>
                {item.comments}
              </Button>
              <Button size="small" startIcon={<ShareIcon />}>
                {item.shares}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
