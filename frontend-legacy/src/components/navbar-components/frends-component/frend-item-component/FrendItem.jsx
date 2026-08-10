import React from "react";
import classes from "./FrendItem.module.css";

const FrendItem = (props) => {
  const label = (props.name || "?").slice(0, 1).toUpperCase();
  return (
    <div className={classes.item}>
      <div className={classes.ava}>{label}</div>
      <div className={classes.name}>{props.name}</div>
    </div>
  );
};

export default FrendItem;
