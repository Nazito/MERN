"use client";

import StoreProvider from "@/components/providers/StoreProvider";
import ThemeRegistry from "@/components/providers/ThemeRegistry";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import AppShell from "@/components/layout/AppShell";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeRegistry>
        <NotificationProvider>
          <SocketProvider>
            <AppShell>{children}</AppShell>
          </SocketProvider>
        </NotificationProvider>
      </ThemeRegistry>
    </StoreProvider>
  );
}
