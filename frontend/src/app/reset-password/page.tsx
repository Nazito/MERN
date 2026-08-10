"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import FormTextField from "@/components/ui/FormTextField";
import { useNotify } from "@/components/providers/NotificationProvider";
import { authAPI } from "@/lib/api";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validation/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const { success, error } = useNotify();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      error("Reset link is missing or invalid");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await authAPI.resetPassword({
        token,
        password: values.password,
      });
      success(data.message || "Password has been reset");
      router.push("/login");
    } catch {
      // toast via axios interceptor
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card
      component="form"
      onSubmit={onSubmit}
      variant="outlined"
      sx={{ width: "100%", maxWidth: 420, borderRadius: 5 }}
    >
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          Account recovery
        </Typography>
        <Typography variant="h5" gutterBottom>
          Set new password
        </Typography>
        {!token && (
          <Typography variant="body2" color="error" mb={1}>
            This reset link is missing a token. Request a new one from the forgot
            password page.
          </Typography>
        )}
        <FormTextField
          name="password"
          control={control}
          type="password"
          fullWidth
          label="New password"
          margin="normal"
          autoComplete="new-password"
          disabled={!token}
        />
        <FormTextField
          name="confirmPassword"
          control={control}
          type="password"
          fullWidth
          label="Confirm password"
          margin="normal"
          autoComplete="new-password"
          disabled={!token}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting || !token}
        >
          Update password
        </Button>
        <MuiLink component={Link} href="/forgot-password" variant="body2">
          Request new link
        </MuiLink>
      </CardActions>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense
        fallback={
          <Box py={8}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </Box>
  );
}
