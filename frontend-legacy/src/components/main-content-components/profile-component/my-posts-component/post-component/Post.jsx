import React from "react";
import classes from "./Post.module.css";

const Post = props => {
  return (
    <div className={classes.item}>
      {props.message}
      <span>{props.like}</span>
    </div>
  );
};

export default Post;
