"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {
  setNotificationHandler,
  notifyFromServer,
  type NotifyOptions,
} from "@/lib/notificationBus";

export type { NotifyOptions };

type NotificationItem = NotifyOptions & {
  id: string;
};

type NotificationContextValue = {
  notify: (options: NotifyOptions | string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

const DEFAULT_DURATION = 4000;

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((options: NotifyOptions | string) => {
    const payload =
      typeof options === "string" ? { message: options } : options;

    if (!payload.message) return;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((prev) => [
      ...prev,
      {
        id,
        message: payload.message,
        severity: payload.severity || "info",
        duration: payload.duration ?? DEFAULT_DURATION,
      },
    ]);
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notify,
      success: (message: string) =>
        notify({ message, severity: "success" }),
      error: (message: string) => notify({ message, severity: "error" }),
      info: (message: string) => notify({ message, severity: "info" }),
      warning: (message: string) =>
        notify({ message, severity: "warning" }),
    }),
    [notify]
  );

  useEffect(() => {
    setNotificationHandler(value.notify);
    // Do not clear on unmount — Strict Mode would drop toasts during remount
  }, [value.notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Stack
        spacing={1}
        sx={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.snackbar,
          maxWidth: 420,
          width: "calc(100% - 48px)",
          pointerEvents: "none",
        }}
      >
        {items.map((item) => (
          <Snackbar
            key={item.id}
            open
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={item.duration}
            onClose={(_, reason) => {
              if (reason === "clickaway") return;
              remove(item.id);
            }}
            sx={{
              position: "relative",
              top: "auto !important",
              right: "auto !important",
              left: "auto !important",
              bottom: "auto !important",
              transform: "none !important",
              pointerEvents: "auto",
            }}
          >
            <Alert
              severity={item.severity}
              variant="filled"
              elevation={4}
              onClose={() => remove(item.id)}
              sx={{ width: "100%", alignItems: "center" }}
            >
              {item.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </NotificationContext.Provider>
  );
}

const busNotify: NotificationContextValue = {
  notify: (options) => notifyFromServer(options),
  success: (message) => notifyFromServer({ message, severity: "success" }),
  error: (message) => notifyFromServer({ message, severity: "error" }),
  info: (message) => notifyFromServer({ message, severity: "info" }),
  warning: (message) => notifyFromServer({ message, severity: "warning" }),
};

export function useNotify() {
  return useContext(NotificationContext) ?? busNotify;
}
