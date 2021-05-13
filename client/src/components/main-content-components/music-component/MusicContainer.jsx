import { connect } from "react-redux";
import { compose } from "redux";
import React, { useEffect } from "react";
import Music from "./Music";
import { createDirThunk, deleteFileThunk, downloadFileThunk, filesThunk, pushToStack, searchFileThunk, setCurrentDir, uploadFileThunk } from "../../../redux/files-reducer";
import { WichAuchRedirect } from "../../../hok/auchRedirect";
// import classes from "./Music.module.css";


const MusicContainer = (props) => {
  return (
    <Music 
      musicList={props.files} 
      filesThunk={props.filesThunk} 
      createDir={props.createDirThunk} 
      currentDir={props.currentDir} 
      setCurrentDir={props.setCurrentDir}
      pushToStack={props.pushToStack}
      dirStack={props.dirStack}
      uploadFile={props.uploadFileThunk}
      downloadFileThunk={props.downloadFileThunk}
      deleteFileThunk={props.deleteFileThunk}
      searchFileThunk={props.searchFileThunk}
    />
  ) 
};

const mapStateToProps = (state) => {
// debugger
  return {
    currentDir: state.fileReducer.currentDir,
    files: state.fileReducer.files,
    dirStack: state.fileReducer.dirStack
  }
};

export default compose(
  connect(mapStateToProps, { createDirThunk, filesThunk, uploadFileThunk, searchFileThunk, downloadFileThunk, deleteFileThunk, setCurrentDir, pushToStack }),
  WichAuchRedirect
  )(MusicContainer);
