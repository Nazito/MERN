"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import FormTextField from "@/components/ui/FormTextField";
import { useAppDispatch } from "@/store/hooks";
import { register as registerUser } from "@/store/slices/authSlice";
import { registerSchema, RegisterFormValues } from "@/lib/validation/auth";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (status === "authenticated") router.replace("/news");
  }, [status, router]);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setSubmitting(true);
    try {
      const result = await dispatch(registerUser(values));
      if (!registerUser.fulfilled.match(result)) {
        setError((result.payload as string) || "Registration failed");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/news",
      });

      if (signInResult?.error) {
        setError(
          "Account created, but sign-in failed. Try logging in manually."
        );
        router.push("/login");
        return;
      }

      router.push("/news");
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
          <Typography
            variant="overline"
            color="text.secondary"
            textAlign="center"
            display="block"
          >
            Join Circle
          </Typography>
          <Typography variant="h5" gutterBottom textAlign="center">
            Sign up
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
            autoComplete="new-password"
          />
          <FormTextField
            name="name"
            control={control}
            fullWidth
            label="Name"
            margin="normal"
            autoComplete="name"
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
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
