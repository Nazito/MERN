import React, { useEffect, useState } from "react";
import MusicList from "./MusicList";

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


import classes from "./Music.module.css";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import UploaderComponent from "../../commons/uploader/UploaderComponent";


const Music = (props) => {
  const [open, setOpen] = useState(false);
  const [dirName, setDirName] = useState("");
  const [dragEnter, setDragEnter] = useState(false)
  const [sort, setSort] = useState('type')
  const [searchName, setSearchName] = useState('')
  const [searchTimeOut, setSearchTimeOut] = useState(false)


  useEffect(() => {
    props.filesThunk(props.currentDir, sort) // get files
  }, [props.currentDir, sort]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeHandler = event =>{
    setDirName(event.target.value) 
  }

  const backClickHandler = () =>{
    const backDirID = props.dirStack.pop()
    props.setCurrentDir(backDirID)
  }  
  
  const fileUploadHandler = (event) =>{
    const files = [...event.target.files]
    files.forEach( file => props.uploadFile(file, props.currentDir))
  }

  const dragEnterHandler = (e) =>{
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(true)
  }  
  
  const sortHandleChange = (e) =>{
    setSort(e.target.value)
  } 

  const searchHandler = (e) =>{
    setSearchName(e.target.value)
    if(searchTimeOut){
      clearTimeout(searchTimeOut)
    }
    if(e.target.value != ''){
      setSearchTimeOut(setTimeout((value) => {
        props.searchFileThunk(value)
      }, 500, e.target.value))
    }else{
      props.filesThunk(props.currentDir)
    }

  }

  const dragLeaveHandler = (e) =>{
    e.preventDefault()
    e.stopPropagation()
    setDragEnter(false)
  }

  const dropHandler = (e) =>{
    e.preventDefault()
    e.stopPropagation()

    let files = [...e.dataTransfer.files]
    files.forEach( file => props.uploadFile(file, props.currentDir))
    setDragEnter(false)
  }

  const createDirHandler = () =>{
    props.createDir( props.currentDir, dirName )
    handleClose()
  }  


  return (
    <>
    {!dragEnter ? (
      <div 
        className={classes.musicContainer}
        onDragEnter={dragEnterHandler}
        onDragLeave={dragLeaveHandler}
        onDragOver={dragEnterHandler}
      >
        <div className="pageHeader" style={{ marginBottom: 12 }}>
          <div>
            <div className="pageEyebrow">Library</div>
            <h1 className="pageTitle">Music & files</h1>
            <p className="pageSubtitle">Upload, folders and search — a mini cloud drive</p>
          </div>
          <span className="badge">file disk</span>
        </div>
        <div
          className={classes.musicContainerNav}
        >
          <IconButton
            onClick={backClickHandler}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Fab 
            color="primary" 
            aria-label="add"
            className={classes.musicContainerNavItem}
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
          <Fab 
            color="secondary" 
            aria-label="add"
            className={classes.musicContainerNavItem}
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>

          <input
            accept="audio/*"
            className={classes.inputUploadFile}
            id="contained-button-file"
            multiple
            type="file"
            onChange={fileUploadHandler}
          />
          <label 
            htmlFor="contained-button-file"
            className={classes.inputUploadBtn}
          >
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>

          <FormControl 
            // variant="outlined" 
            className={classes.formControl}
            >
            <InputLabel id="demo-simple-select-outlined-label">Sort</InputLabel>
            <Select
              // labelId="demo-simple-select-outlined-label"
              // id="demo-simple-select-outlined"
              value={sort}
              onChange={sortHandleChange}
              label="Age"
            >
              <MenuItem value={'name'}>By name</MenuItem>
              <MenuItem value={'type'}>By type</MenuItem>
              <MenuItem value={'date'}>By date</MenuItem>
            </Select>
          </FormControl>


          <form className={classes.root} noValidate autoComplete="on">
            <TextField 
              id="standard-basic" 
              label="Search" 
              value={searchName}
              onChange={searchHandler}
            />
          </form>
        </div>

        {/* =========================== Music list */}
        <MusicList 
          musicList={props.musicList} 
          setCurrentDir={props.setCurrentDir} 
          currentDir={props.currentDir}
          pushToStack={props.pushToStack}
          downloadFileThunk={props.downloadFileThunk}
          deleteFileThunk={props.deleteFileThunk}
        />

        {/* =========================== Popup create dir */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Enter folder name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter name"
              type="text"
              fullWidth
              onChange={changeHandler}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={createDirHandler} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    ):(
      <div
        className={classes.musicDragContainer}
        onDragEnter={dragEnterHandler}
        onDragLeave={dragLeaveHandler}
        onDragOver={dragEnterHandler}
        onDrop={dropHandler}
      >
        <div
          className={classes.musicDragContainerContent}
        >
          Drop files here
        </div>
      </div>
    )}
      <UploaderComponent />
    </>
  )
};

export default Music;
