"use client";

import { useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers } from "@/store/slices/usersSlice";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Discover
          </Typography>
          <Typography variant="h4">People</Typography>
          <Typography variant="body2" color="text.secondary">
            Find new friends in Circle
          </Typography>
        </Box>
        <Chip label={`${users.length} people`} color="primary" variant="outlined" size="small" />
      </Box>

      {status === "loading" ? (
        <Box display="grid" sx={{ placeItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        >
          {users.map((user) => {
            const initial = (user.name || user.email || "?").slice(0, 1).toUpperCase();
            return (
              <Card key={user._id} variant="outlined">
                <Box
                  sx={{
                    height: 96,
                    background:
                      "linear-gradient(135deg, rgba(45,212,191,0.35), #e7eef7)",
                  }}
                />
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{initial}</Avatar>}
                  title={user.name || "No name"}
                  subheader={user.email}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Circle member. Open the profile to see more details.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" component={Link} href={`/profile/${user._id}`}>
                    Profile
                  </Button>
                  <Button size="small" disabled>
                    Follow
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
