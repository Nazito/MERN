"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const { isAuth, name } = useAppSelector((s) => s.auth);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,0.92)",
        color: "text.primary",
        boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 2, minHeight: 64 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            variant="rounded"
            sx={{
              width: 38,
              height: 38,
              borderRadius: 3,
              bgcolor: "primary.main",
              fontFamily: '"Fraunces", Georgia, serif',
              fontWeight: 700,
            }}
          >
            C
          </Avatar>
          <Box>
            <Typography variant="h6" lineHeight={1.1}>
              Circle
            </Typography>
            <Typography variant="caption" color="text.secondary">
              your feed and people circle
            </Typography>
          </Box>
        </Box>

        {isAuth ? (
          <Box display="flex" alignItems="center" gap={1.25}>
            <Avatar sx={{ width: 36, height: 36 }}>
              {(name || "U").slice(0, 1).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2">{name}</Typography>
            <Button variant="outlined" size="small" onClick={() => dispatch(logout())}>
              Log out
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <Button component={Link} href="/register" color="inherit">
              Sign up
            </Button>
            <Button component={Link} href="/login" variant="contained" color="primary">
              Log in
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
