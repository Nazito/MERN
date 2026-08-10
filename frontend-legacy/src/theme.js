import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
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
    success: {
      main: "#0f766e",
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundColor: "#eef1f4",
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 16,
      },
      elevation1: {
        boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
      },
    },
    MuiButton: {
      root: {
        borderRadius: 999,
      },
      containedPrimary: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      root: {
        backgroundColor: "#f7f8fa",
      },
    },
    MuiListItem: {
      root: {
        borderRadius: 12,
      },
      button: {
        "&:hover": {
          backgroundColor: "#f7f8fa",
        },
      },
    },
    MuiCard: {
      root: {
        border: "1px solid #d9e0e6",
        boxShadow: "none",
      },
    },
    MuiTextField: {
      root: {
        backgroundColor: "#fff",
      },
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
});

export default theme;
