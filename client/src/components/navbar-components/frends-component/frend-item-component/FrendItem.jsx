import React from "react";
// import classes from "./FrendItem.module.css";

const FrendItem = props => {
  return (
    <div>
      <div className="">
        <div>{props.ava}</div>
        {props.name}
      </div>
    </div>
  );
};

export default FrendItem;
