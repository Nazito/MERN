"use client";

import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/components/providers/StoreProvider";
import ThemeRegistry from "@/components/providers/ThemeRegistry";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import SessionSync from "@/components/providers/SessionSync";
import AppShell from "@/components/layout/AppShell";
import { NEXTAUTH_BASE_PATH } from "@/lib/authBasePath";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath={NEXTAUTH_BASE_PATH} refetchInterval={4 * 60}>
      <StoreProvider>
        <ThemeRegistry>
          <NotificationProvider>
            <SessionSync />
            <SocketProvider>
              <AppShell>{children}</AppShell>
            </SocketProvider>
          </NotificationProvider>
        </ThemeRegistry>
      </StoreProvider>
    </SessionProvider>
  );
}
