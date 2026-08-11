"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeApp } from "@/store/slices/appSlice";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((s) => s.app.initialized);
  const { status } = useSession();

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  if (!initialized || status === "loading") {
    return (
      <Box
        minHeight="100dvh"
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
        height: "100dvh",
        maxHeight: "100dvh",
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
        gridTemplateRows: {
          xs: "auto auto minmax(0, 1fr)",
          md: "auto minmax(0, 1fr)",
        },
        gap: 2,
        p: { xs: 1.25, md: 2 },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box sx={{ gridColumn: { md: "1 / -1" } }}>
        <Header />
      </Box>
      <Box sx={{ minHeight: 0, overflowY: "auto" }}>
        <Sidebar />
      </Box>
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
