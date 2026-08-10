"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import MuiLink from "@mui/material/Link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthMessage, register } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authMsg, isAuth } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  useEffect(() => {
    if (isAuth) router.replace("/news");
  }, [isAuth, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthMessage());
    };
  }, [dispatch]);

  const onSubmit = async () => {
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      router.push("/news");
    }
  };

  return (
    <Box
      minHeight="100%"
      display="flex"
      justifyContent="center"
      p={{ xs: 2, md: 5 }}
      sx={{
        background:
          "radial-gradient(600px 240px at 20% 0%, rgba(45,212,191,0.2) 0%, transparent 60%), linear-gradient(180deg, #f8fbfa 0%, #ffffff 55%)",
      }}
    >
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 420, borderRadius: 5 }}>
        {authMsg && <Alert severity="error">{authMsg}</Alert>}
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Join Circle
          </Typography>
          <Typography variant="h5" gutterBottom>
            Sign up
          </Typography>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Sign up
          </Button>
          <MuiLink component={Link} href="/login" variant="body2">
            Log in
          </MuiLink>
        </CardActions>
      </Card>
    </Box>
  );
}
