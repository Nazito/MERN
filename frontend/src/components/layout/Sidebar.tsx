"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PeopleIcon from "@mui/icons-material/People";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers } from "@/store/slices/usersSlice";
import { avatarUrl } from "@/lib/api";

const links = [
  { href: "/news", label: "Feed", icon: HomeIcon },
  { href: "/message", label: "Messages", icon: ChatBubbleIcon },
  { href: "/users", label: "People", icon: PeopleIcon },
  { href: "/music", label: "Music", icon: LibraryMusicIcon },
];

const SIDEBAR_PEOPLE_LIMIT = 6;

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector((s) => s.users);
  const currentUserId = useAppSelector((s) => s.auth.currentUser?.userId);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const people = useMemo(() => {
    return users
      .filter((u) => u._id !== currentUserId)
      .slice(0, SIDEBAR_PEOPLE_LIMIT);
  }, [users, currentUserId]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
        height: "fit-content",
        position: { md: "sticky" },
        top: 16,
        bgcolor: "rgba(255,255,255,0.94)",
      }}
    >
      <List component="nav" disablePadding>
        {links.map((link) => {
          const Icon = link.icon;
          const selected =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <ListItemButton
              key={link.href}
              component={Link}
              href={link.href}
              selected={selected}
              sx={{
                mb: 0.5,
                borderRadius: 3,
                px: 1.5,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": { color: "inherit" },
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 1.75 }} />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={0.75}
        mb={1}
      >
        <Typography
          variant="caption"
          sx={{
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "text.secondary",
          }}
        >
          People
        </Typography>
        <Button
          component={Link}
          href="/users"
          size="small"
          sx={{ minWidth: 0, px: 0.75, fontSize: 12, textTransform: "none" }}
        >
          See all
        </Button>
      </Box>

      <Stack spacing={0.5}>
        {status === "loading" || status === "idle"
          ? Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                display="flex"
                alignItems="center"
                gap={1.25}
                px={1}
                py={0.85}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Box flex={1}>
                  <Skeleton width="70%" height={14} />
                  <Skeleton width="45%" height={12} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            ))
          : people.map((user) => {
              const name = user.name || "Member";
              const photo = avatarUrl(user.avatar);
              const subtitle =
                user.bio?.trim() ||
                (user.email ? user.email.split("@")[0] : "Circle member");

              return (
                <Box
                  key={user._id}
                  component={Link}
                  href={`/profile/${user._id}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1,
                    py: 0.85,
                    borderRadius: 3,
                    color: "inherit",
                    textDecoration: "none",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Avatar
                    src={photo}
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: 15,
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    {name.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box minWidth={0} flex={1}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      display="block"
                    >
                      {subtitle}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

        {status === "succeeded" && people.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            px={1}
            py={1.5}
          >
            No people yet
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
