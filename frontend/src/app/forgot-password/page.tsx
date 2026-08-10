"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import FormTextField from "@/components/ui/FormTextField";
import { useNotify } from "@/components/providers/NotificationProvider";
import { authAPI } from "@/lib/api";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/validation/auth";

export default function ForgotPasswordPage() {
  const { success } = useNotify();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const { data } = await authAPI.forgotPassword(values);
      success(data.message || "Check your email for a reset link");
    } catch {
      // toast via axios interceptor
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
            Account recovery
          </Typography>
          <Typography variant="h5" gutterBottom>
            Forgot password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Enter your email and we will send a reset link if an account exists.
          </Typography>
          <FormTextField
            name="email"
            control={control}
            fullWidth
            label="Email"
            margin="normal"
            autoComplete="email"
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            Send link
          </Button>
          <MuiLink component={Link} href="/login" variant="body2">
            Back to log in
          </MuiLink>
        </CardActions>
      </Card>
    </Box>
  );
}
