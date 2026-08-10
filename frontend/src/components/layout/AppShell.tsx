"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeApp } from "@/store/slices/appSlice";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((s) => s.app.initialized);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  if (!initialized) {
    return (
      <Box
        minHeight="100vh"
        display="grid"
        sx={{ placeItems: "center", bgcolor: "background.default" }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "min(1280px, 100%)",
        minHeight: "100vh",
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
        gridTemplateRows: { xs: "auto auto 1fr", md: "64px 1fr" },
        gap: 2,
        p: { xs: 1.25, md: 2 },
      }}
    >
      <Box sx={{ gridColumn: { md: "1 / -1" } }}>
        <Header />
      </Box>
      <Sidebar />
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
