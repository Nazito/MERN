"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMessage } from "@/store/slices/messagesSlice";

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const { dialogs, messages } = useAppSelector((s) => s.messages);
  const [text, setText] = useState("");

  const onSend = () => {
    const value = text.trim();
    if (!value) return;
    dispatch(addMessage(value));
    setText("");
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "280px 1fr" }}
      minHeight="100%"
    >
      <Box sx={{ borderRight: { md: "1px solid" }, borderColor: "divider", bgcolor: "grey.50", p: 2 }}>
        <Typography variant="overline" color="text.secondary">
          Inbox
        </Typography>
        <Typography variant="h5" gutterBottom>
          Messages
        </Typography>
        <List disablePadding>
          {dialogs.map((d) => (
            <ListItemButton key={d.id} sx={{ borderRadius: 1.5, mb: 0.5 }}>
              <ListItemAvatar>
                <Avatar>{d.name.slice(0, 1)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={d.name} secondary="Open chat" />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box display="flex" flexDirection="column" minWidth={0}>
        <Box p={2}>
          <Typography variant="subtitle1">Conversation</Typography>
          <Typography variant="body2" color="text.secondary">
            demo chat without websockets
          </Typography>
        </Box>
        <Divider />
        <Box
          flex={1}
          p={2}
          display="grid"
          gap={1.25}
          alignContent="start"
          sx={{ background: "linear-gradient(180deg, #ffffff 0%, #f7faf9 100%)" }}
        >
          {messages.map((m) => (
            <Paper
              key={m.id}
              elevation={0}
              sx={{
                maxWidth: "70%",
                width: "fit-content",
                p: 1.5,
                borderRadius: "10px 10px 10px 4px",
                bgcolor: "#e7f6f2",
              }}
            >
              <Typography variant="body2">{m.message}</Typography>
            </Paper>
          ))}
        </Box>
        <Box p={1.75} borderTop="1px solid" borderColor="divider" display="grid" gridTemplateColumns="1fr auto" gap={1.25}>
          <TextField
            size="small"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <Button variant="contained" onClick={onSend}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
