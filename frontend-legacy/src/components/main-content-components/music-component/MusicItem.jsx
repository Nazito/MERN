import React, { useEffect, useState } from "react";

import CardActionArea from '@material-ui/core/CardActionArea';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';

import musicBgDefault from "../../../assets/img/music_preiview.png";
import playListBgDefault from "../../../assets/img/playlist-preview.jpg";

import classes from "./Music.module.css";


const MusicItem = (props) => {

  const theme = useTheme();
  let [file, setFile] = useState(props.file)

  useEffect(() => {
    setFile(file)
  }, [file]);



  const openDirHandler = () =>{
    props.pushToStack(props.currentDir)
    props.setCurrentDir(props.file._id)
  } 
  
  const downloadClickHandler = (e) =>{
    e.stopPropagation()
    props.downloadFileThunk(file)
  }

  const deleteClickHandler = (e) =>{
    e.stopPropagation()
    props.deleteFileThunk(props.file)
  }

  return (
    <>
    {props.file.type === "dir"  ? (
      <div
        className={classes.musicItem}
        onClick={openDirHandler}
      >
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.playListMedia}
              image={playListBgDefault}
              title="Contemplative Reptile"
            />
            <CardContent
              className={classes.playListInfo}
            >
              <Typography 
                gutterBottom 
                variant="h6" 
                component="h3"
                className={classes.playListCount}
              >
                12
              </Typography>

              <PlaylistPlayIcon 
                className={classes.playListIcon}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      ) : ( 
      <div
        className={classes.musicItem}
      >
        <Card className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              { props.file && 
              (<Typography component="h6" variant="h6">
                {props.file.name}
              </Typography>)
              }
            </CardContent>   
            <div className={classes.controls}>
              <IconButton aria-label="previous">
                {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
              </IconButton>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
              <IconButton aria-label="next">
                {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
              </IconButton>
              <IconButton>
                <GetAppIcon 
                  onClick={downloadClickHandler}
                />
              </IconButton>       
              <IconButton>
                <DeleteIcon 
                  onClick={deleteClickHandler}
                />
              </IconButton>
            </div>
          </div>
          <CardMedia
            className={classes.cover}
            image={musicBgDefault}
            title="Live from space album cover"
          />
        </Card>
      </div>
    )} 
    </>
  )
};

export default MusicItem;
