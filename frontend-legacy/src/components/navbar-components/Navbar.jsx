import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import LibraryMusicOutlinedIcon from "@material-ui/icons/LibraryMusicOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import Frends from "./frends-component/Frends";

const useStyles = makeStyles((theme) => ({
  root: {
    gridArea: "nav",
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(21, 32, 43, 0.06)",
    height: "fit-content",
    position: "sticky",
    top: 16,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  icon: {
    minWidth: 36,
    color: theme.palette.text.secondary,
  },
  active: {
    backgroundColor: `${theme.palette.primary.main}14 !important`,
    color: theme.palette.primary.dark,
    "& $icon": {
      color: theme.palette.primary.main,
    },
  },
  sectionTitle: {
    margin: theme.spacing(1.5, 1, 1),
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontSize: 11,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
}));

const links = [
  { to: "/profile", label: "Profile", icon: PersonOutlineIcon },
  { to: "/news", label: "Feed", icon: HomeOutlinedIcon },
  { to: "/message", label: "Messages", icon: ChatBubbleOutlineIcon },
  { to: "/users", label: "People", icon: PeopleOutlineIcon },
  { to: "/music", label: "Music", icon: LibraryMusicOutlinedIcon },
  { to: "/settings", label: "Settings", icon: SettingsOutlinedIcon },
];

const Navbar = (props) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Paper className={classes.root} elevation={0}>
      <List component="nav" disablePadding>
        {links.map((link) => {
          const Icon = link.icon;
          const selected =
            location.pathname === link.to ||
            location.pathname.startsWith(link.to + "/");
          return (
            <ListItem
              key={link.to}
              button
              component={NavLink}
              to={link.to}
              selected={selected}
              classes={{ selected: classes.active }}
            >
              <ListItemIcon className={classes.icon}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          );
        })}
      </List>

      <Divider style={{ margin: "12px 0" }} />
      <Typography className={classes.sectionTitle}>Friends online</Typography>
      <Box
        component={NavLink}
        to="/frends-content"
        style={{ display: "block", color: "inherit" }}
      >
        <Frends store={props.store} />
      </Box>
    </Paper>
  );
};

export default Navbar;
