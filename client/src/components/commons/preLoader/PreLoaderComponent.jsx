import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import classes from "./PreLoaderComponent.module.css";

const PreLoaderComponent = () => {
  return (
    <div className={classes.PreLoaderContainer}>
      <CircularProgress />
    </div>
  );
};

export default PreLoaderComponent;
