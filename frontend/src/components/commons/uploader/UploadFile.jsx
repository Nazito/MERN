import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import classes from "./UploaderComponent.module.css";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';

const UploadFile = (props) => {

  const removeUploadedFile = () => {
    props.removeUploadFile(props.file.id)
  }

  return (
    <>
      <ListItem className={classes.uploadFile}>
        <div className={classes.uploadFile__header}>
          <ListItemText primary={props.file.name} />
          <IconButton>
            <CloseIcon 
              onClick={removeUploadedFile}
            />
          </IconButton>  
        </div>
        <LinearProgress className={classes.uploadFile__progress} variant="determinate" value={props.file.progress} />
      </ListItem>
      <Divider />
    </>
  );
};

export default UploadFile;
