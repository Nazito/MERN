"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f766e",
      dark: "#115e59",
      light: "#2dd4bf",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#334155",
      contrastText: "#ffffff",
    },
    background: {
      default: "#eef1f4",
      paper: "#ffffff",
    },
    text: {
      primary: "#15202b",
      secondary: "#667788",
    },
    divider: "#d9e0e6",
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 },
    h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 },
    h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 },
    h6: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        sizeSmall: { borderRadius: 6 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
        sizeSmall: { borderRadius: 6 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #d9e0e6",
          boxShadow: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 8 },
        elevation1: {
          boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 8 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: 8 },
        },
      },
    },
  },
});

export default theme;
