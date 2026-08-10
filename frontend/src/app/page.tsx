"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function HomePage() {
  const router = useRouter();
  const initialized = useAppSelector((s) => s.app.initialized);
  const isAuth = useAppSelector((s) => s.auth.isAuth);

  useEffect(() => {
    if (!initialized) return;
    router.replace(isAuth ? "/news" : "/register");
  }, [initialized, isAuth, router]);

  return (
    <Box minHeight={320} display="grid" sx={{ placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}
