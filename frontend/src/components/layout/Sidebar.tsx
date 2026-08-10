"use client";

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
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PeopleIcon from "@mui/icons-material/People";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { useAppSelector } from "@/store/hooks";

const links = [
  { href: "/news", label: "Feed", icon: HomeIcon },
  { href: "/message", label: "Messages", icon: ChatBubbleIcon },
  { href: "/users", label: "People", icon: PeopleIcon },
  { href: "/music", label: "Music", icon: LibraryMusicIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const friends = useAppSelector((s) => s.friends.friends);

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

      <Divider sx={{ my: 1.5 }} />
      <Typography
        variant="caption"
        sx={{
          px: 1,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "text.secondary",
        }}
      >
        Friends online
      </Typography>
      <Box component={Link} href="/friends" sx={{ display: "block", color: "inherit", mt: 1 }}>
        {friends.map((f) => (
          <Box key={f.name} display="flex" alignItems="center" gap={1} py={0.75} px={1}>
            <Avatar sx={{ width: 34, height: 34, fontSize: 12 }}>
              {f.name.slice(0, 1)}
            </Avatar>
            <Typography variant="body2" fontWeight={600}>
              {f.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
