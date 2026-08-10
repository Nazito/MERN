"use client";

import { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { avatarUrl } from "@/lib/api";

export default function Header() {
  const dispatch = useAppDispatch();
  const { isAuth, name, currentUser } = useAppSelector((s) => s.auth);
  const photo = avatarUrl(currentUser?.avatar);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    closeMenu();
    dispatch(logout());
  };

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
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              aria-label="Account menu"
              aria-controls={menuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              sx={{
                gap: 0.75,
                borderRadius: 3,
                px: 0.75,
                py: 0.5,
                border: "1px solid",
                borderColor: menuOpen ? "primary.main" : "divider",
                bgcolor: menuOpen ? "action.hover" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Avatar
                src={photo}
                sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.main" }}
              >
                {(name || "U").slice(0, 1).toUpperCase()}
              </Avatar>
              <Typography
                variant="subtitle2"
                sx={{ display: { xs: "none", sm: "block" }, pr: 0.25 }}
              >
                {name}
              </Typography>
              <KeyboardArrowDownIcon
                fontSize="small"
                sx={{
                  color: "text.secondary",
                  transform: menuOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s ease",
                }}
              />
            </IconButton>

            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeMenu}
              onClick={closeMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1,
                  minWidth: 220,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 12px 32px rgba(21, 32, 43, 0.12)",
                },
              }}
            >
              <Box px={2} py={1.25} display="flex" alignItems="center" gap={1.25}>
                <Avatar
                  src={photo}
                  sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                >
                  {(name || "U").slice(0, 1).toUpperCase()}
                </Avatar>
                <Box minWidth={0}>
                  <Typography variant="subtitle2" noWrap>
                    {name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your account
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <MenuItem component={Link} href="/profile">
                <ListItemIcon>
                  <PersonOutlineIcon fontSize="small" />
                </ListItemIcon>
                View profile
              </MenuItem>
              <MenuItem component={Link} href="/settings">
                <ListItemIcon>
                  <SettingsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Log out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <Button component={Link} href="/register" color="inherit">
              Sign up
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              color="primary"
            >
              Log in
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
