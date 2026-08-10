"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useAppSelector } from "@/store/hooks";

const demoMeta: Record<string, { status: string; city: string }> = {
  Tod: { status: "online", city: "Moscow" },
  Olya: { status: "active 5 min ago", city: "Saint Petersburg" },
  Vell: { status: "online", city: "Kazan" },
  Kolya: { status: "listening to music", city: "Yekaterinburg" },
  Loh: { status: "offline", city: "Sochi" },
};

export default function FriendsPage() {
  const friends = useAppSelector((s) => s.friends.friends);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            People
          </Typography>
          <Typography variant="h4">Friends</Typography>
          <Typography variant="body2" color="text.secondary">
            Friend list and statuses — demo data
          </Typography>
        </Box>
        <Chip label={`${friends.length} friends`} color="primary" variant="outlined" size="small" />
      </Box>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
      >
        {friends.map((f) => {
          const meta = demoMeta[f.name] || { status: "online", city: "Unknown" };
          return (
            <Card key={f.name} variant="outlined">
              <CardHeader
                avatar={<Avatar>{f.name.slice(0, 1)}</Avatar>}
                title={f.name}
                subheader={meta.status}
              />
              <CardActions>
                <Chip size="small" label={meta.city} />
                <Button size="small" color="primary">
                  Message
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
