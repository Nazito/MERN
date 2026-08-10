import React from "react";
import { NavLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { API_URL } from "../../config.js";

const useStyles = makeStyles((theme) => ({
  appBar: {
    gridArea: "header",
    borderRadius: theme.shape.borderRadius + 4,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "rgba(255,255,255,0.92)",
    color: theme.palette.text.primary,
    boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
  },
  toolbar: {
    minHeight: 64,
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(2),
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
  },
  mark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: "#fff",
    fontFamily: '"Fraunces", Georgia, serif',
    fontWeight: 700,
  },
  tag: {
    color: theme.palette.text.secondary,
    fontSize: 12,
  },
  userBlock: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.25),
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const avatar = props.user.avatar ? `${API_URL + props.user.avatar}` : "";

  return (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.brand}>
          <Avatar className={classes.mark} variant="rounded">
            C
          </Avatar>
          <Box>
            <Typography variant="h6">Circle</Typography>
            <Typography className={classes.tag}>
              your feed and people circle
            </Typography>
          </Box>
        </Box>

        {props.isAuth ? (
          <Box className={classes.userBlock}>
            <Avatar src={avatar}>
              {(props.login || "U").slice(0, 1).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2">{props.login}</Typography>
            <Button variant="outlined" size="small" onClick={props.logout}>
              Log out
            </Button>
          </Box>
        ) : (
          <Box className={classes.userBlock}>
            <Button component={NavLink} to="/register" color="inherit">
              Sign up
            </Button>
            <Button component={NavLink} to="/login" variant="contained" color="primary">
              Log in
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
