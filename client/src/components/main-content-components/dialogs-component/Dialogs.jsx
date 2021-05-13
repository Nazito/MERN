import React from "react"; //, { createRef } 
import classes from "./Dialogs.module.css";
import DialogItem from "./dialog-item-component/DialogItem";
import MessagesItem from "./messages-item-component/MessagesItem";
import { Field, reduxForm } from "redux-form";
import { Textarea } from "../../commons/formControls/formsControl";
import {
  maxLengthCreatore,
  requiredField,
} from "../../../utils/validators/validators";

const maxLength10 = maxLengthCreatore(10);

const Dialogs = (props) => {
  let messageItems = props.stateMesaages.messages.map((m) => {
    return <MessagesItem message={m.message} key={m.id} />;
  });

  let dialogItems = props.stateMesaages.dialogs.map((d) => {
    return <DialogItem name={d.name} id="3" key={d.id} />;
  });

  let addNewMessage = (v) => {
    props.addMessage(v.newMessageText);
  };

  return (
    <div className={classes.dialogs}>
      <div className={classes.dialogsItems}>{dialogItems}</div>

      <div className={classes.messages}>{messageItems}</div>
      <AddMessageFormRedux onSubmit={addNewMessage} />
    </div>
  );
};

const AddMessageForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        component={Textarea}
        name="newMessageText"
        placeholder="enter your message"
        validate={[requiredField, maxLength10]}
      />

      <button>send</button>
    </form>
  );
};

const AddMessageFormRedux = reduxForm({ form: "dialogAddMessageForm" })(
  AddMessageForm
);

export default Dialogs;
