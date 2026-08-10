"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const settings = [
  { title: "Profile", text: "Name, avatar and short bio" },
  { title: "Privacy", text: "Who can see posts and friend lists" },
  { title: "Notifications", text: "Messages, likes and mentions" },
  { title: "Security", text: "Password and active sessions" },
];

export default function SettingsPage() {
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Account
          </Typography>
          <Typography variant="h4">Settings</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage account and privacy preferences
          </Typography>
        </Box>
        <Chip label="coming soon" color="primary" variant="outlined" size="small" />
      </Box>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
      >
        {settings.map((item) => (
          <Card key={item.title} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" disabled>
                Open later
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
