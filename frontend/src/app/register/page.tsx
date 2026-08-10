"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "@/store/slices/authSlice";
import { registerSchema, RegisterFormValues } from "@/lib/validation/auth";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuth } = useAppSelector((s) => s.auth);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAuth) router.replace("/news");
  }, [isAuth, router]);

  const onSubmit = handleSubmit(async (values) => {
    const result = await dispatch(register(values));
    if (register.fulfilled.match(result)) {
      router.push("/news");
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
        sx={{ width: "100%", maxWidth: 420, borderRadius: 5 }}
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
          <Button type="submit" variant="contained" color="primary">
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
