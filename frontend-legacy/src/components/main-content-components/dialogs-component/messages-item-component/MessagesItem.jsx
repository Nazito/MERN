import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  bubble: {
    maxWidth: "70%",
    width: "fit-content",
    padding: theme.spacing(1.5, 1.75),
    borderRadius: "16px 16px 16px 4px",
    backgroundColor: "#e7f6f2",
  },
}));

const MessagesItem = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.bubble} elevation={0}>
      <Typography variant="body2">{props.message}</Typography>
    </Paper>
  );
};

export default MessagesItem;
