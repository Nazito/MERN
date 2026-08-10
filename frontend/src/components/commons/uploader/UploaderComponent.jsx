import React from "react";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import classes from "./UploaderComponent.module.css";
import List from '@material-ui/core/List';
import UploadFile from "./UploadFile";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { connect } from "react-redux";
import { hideUploader, removeUploadFile } from "../../../redux/upload-reducer";

const UploaderComponent = (props) => {
  const files = props.files
  const hideUploaderHandler = () => {
    props.hideUploader()
  }

  return (props.isVisible &&
    <Card 
    className={classes.uploader} 
    variant="outlined">
      <div className={classes.uploader__header}>
        <Typography className={classes.uploader__title} color="textSecondary" gutterBottom>
          Uploads
        </Typography>
        <IconButton>
          <CloseIcon 
            onClick={hideUploaderHandler}
          />
        </IconButton>  
      </div>
      <Divider />
      <List component="nav" className={classes.uploader__content} aria-label="mailbox folders">
        {files.map((file)=> <UploadFile key={file.id} file={file} removeUploadFile={props.removeUploadFile}/>)}
      </List>
    </Card>
  );
};

const mapStateToProps = (state) => {
  // debugger
  return {
    isVisible: state.uploadReducer.isVisible,
    files: state.uploadReducer.files
  }
};



export default connect(mapStateToProps, { hideUploader, removeUploadFile })(UploaderComponent);
