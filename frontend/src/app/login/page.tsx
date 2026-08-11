"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormTextField from "@/components/ui/FormTextField";
import { loginSchema, LoginFormValues } from "@/lib/validation/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/news";

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  });

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
      <Card
        component="form"
        onSubmit={onSubmit}
        variant="outlined"
        sx={{ width: "100%", maxWidth: 420, borderRadius: 2 }}
      >
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Welcome back
          </Typography>
          <Typography variant="h5" gutterBottom>
            Log in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {error}
            </Alert>
          )}
          <FormTextField
            name="email"
            control={control}
            fullWidth
            label="Email"
            margin="normal"
            autoComplete="email"
          />
          <FormTextField
            name="password"
            control={control}
            type="password"
            fullWidth
            label="Password"
            margin="normal"
            autoComplete="current-password"
          />
          <Box textAlign="right" mt={0.5}>
            <MuiLink component={Link} href="/forgot-password" variant="body2">
              Forgot password?
            </MuiLink>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            Log in
          </Button>
          <MuiLink component={Link} href="/register" variant="body2">
            Create account
          </MuiLink>
        </CardActions>
      </Card>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box py={8} display="flex" justifyContent="center">
          <CircularProgress size={28} />
        </Box>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
