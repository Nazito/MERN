import React from "react";
import { NavLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

const DialogItem = (props) => {
  return (
    <ListItem
      button
      component={NavLink}
      to={"/message/" + props.id}
      style={{ borderRadius: 12, marginBottom: 4 }}
    >
      <ListItemAvatar>
        <Avatar>{(props.name || "?").slice(0, 1)}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.name} secondary="Open chat" />
    </ListItem>
  );
};

export default DialogItem;
