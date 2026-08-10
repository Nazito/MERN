import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import DialogItem from "./dialog-item-component/DialogItem";
import MessagesItem from "./messages-item-component/MessagesItem";
import { Field, reduxForm } from "redux-form";
import { Textarea } from "../../commons/formControls/formsControl";
import {
  maxLengthCreatore,
  requiredField,
} from "../../../utils/validators/validators";

const maxLength100 = maxLengthCreatore(100);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    minHeight: "100%",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  sidebar: {
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  chatHeader: {
    padding: theme.spacing(2),
  },
  messages: {
    flex: 1,
    overflow: "auto",
    padding: theme.spacing(2),
    display: "grid",
    gap: theme.spacing(1.25),
    alignContent: "start",
    background: "linear-gradient(180deg, #ffffff 0%, #f7faf9 100%)",
  },
  composer: {
    padding: theme.spacing(1.75),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: theme.spacing(1.25),
    alignItems: "end",
  },
  empty: {
    textAlign: "center",
    padding: theme.spacing(5, 2),
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: 16,
    color: theme.palette.text.secondary,
  },
}));

const Dialogs = (props) => {
  const classes = useStyles();

  const messageItems = props.stateMesaages.messages.map((m) => (
    <MessagesItem message={m.message} key={m.id} />
  ));

  const dialogItems = props.stateMesaages.dialogs.map((d) => (
    <DialogItem name={d.name} id={d.id} key={d.id} />
  ));

  const addNewMessage = (v) => {
    props.addMessage(v.newMessageText);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.sidebar}>
        <Typography variant="overline" color="textSecondary">
          Inbox
        </Typography>
        <Typography variant="h5" gutterBottom>
          Messages
        </Typography>
        <List disablePadding>{dialogItems}</List>
      </Box>

      <Box className={classes.chat}>
        <Box className={classes.chatHeader}>
          <Typography variant="subtitle1">Conversation</Typography>
          <Typography variant="body2" color="textSecondary">
            demo chat without websockets
          </Typography>
        </Box>
        <Divider />
        <Box className={classes.messages}>
          {messageItems.length ? (
            messageItems
          ) : (
            <Paper className={classes.empty} elevation={0}>
              <Typography variant="subtitle1" color="textPrimary">
                Quiet for now
              </Typography>
              <Typography variant="body2">
                Write the first message below
              </Typography>
            </Paper>
          )}
        </Box>
        <Box className={classes.composer}>
          <AddMessageFormRedux onSubmit={addNewMessage} classes={classes} />
        </Box>
      </Box>
    </Box>
  );
};

const AddMessageForm = (props) => {
  return (
    <form className={props.classes.form} onSubmit={props.handleSubmit}>
      <Field
        component={Textarea}
        name="newMessageText"
        placeholder="Write a message..."
        validate={[requiredField, maxLength100]}
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </form>
  );
};

const AddMessageFormRedux = reduxForm({ form: "dialogAddMessageForm" })(
  AddMessageForm
);

export default Dialogs;
