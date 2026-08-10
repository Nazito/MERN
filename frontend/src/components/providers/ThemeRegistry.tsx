"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import SocketProvider from "@/components/providers/SocketProvider";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <SocketProvider>{children}</SocketProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
