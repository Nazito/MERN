"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ShareIcon from "@mui/icons-material/Share";

const feed = [
  {
    id: 1,
    author: "Maria K.",
    initials: "MK",
    time: "12 min",
    text: "Built a calm evening playlist. Anyone else listening to something soft after work?",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: "Ilya R.",
    initials: "IR",
    time: "1 h",
    text: "Uploaded new trip photos. The weather was perfect — almost postcard material.",
    likes: 61,
    comments: 14,
    shares: 11,
  },
  {
    id: 3,
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
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2.5} gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Home
          </Typography>
          <Typography variant="h4">Feed</Typography>
          <Typography variant="body2" color="text.secondary">
            What is new with people in your circle
          </Typography>
        </Box>
        <Chip label="demo posts" color="primary" variant="outlined" size="small" />
      </Box>

      <Paper
        elevation={0}
        sx={{ p: 2, mb: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}
      >
        <Typography variant="subtitle1" gutterBottom>
          What is on your mind?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Post composer will arrive later. For now enjoy the demo feed.
        </Typography>
        <Box display="flex" gap={1}>
          <Chip label="Photo" size="small" />
          <Chip label="Music" size="small" />
          <Chip label="Poll" size="small" />
        </Box>
      </Paper>

      <Box display="grid" gap={1.75}>
        {feed.map((item) => (
          <Card key={item.id} variant="outlined" sx={{ borderRadius: 4 }}>
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
