"use client";

import { useState } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type FormTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error" | "helperText"
> & {
  name: FieldPath<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  /** Enables show/hide toggle when type is password */
  passwordToggle?: boolean;
};

export default function FormTextField<T extends FieldValues>({
  name,
  control,
  rules,
  type = "text",
  passwordToggle = type === "password",
  InputProps,
  ...rest
}: FormTextFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && passwordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...rest}
          {...field}
          value={field.value ?? ""}
          type={inputType}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          InputProps={{
            ...InputProps,
            ...(isPassword && passwordToggle
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : null),
          }}
        />
      )}
    />
  );
}
