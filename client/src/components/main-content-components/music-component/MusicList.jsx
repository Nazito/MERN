import React, { useEffect, useState } from "react";
import MusicItem from "./MusicItem";
import classes from "./Music.module.css";
import "./MusicAnimation.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";



const MusicList = (props) => {

  // let musicList = props.musicList.map((file, i) => <MusicItem currentDir={props.currentDir} deleteFileThunk={props.deleteFileThunk} downloadFileThunk={props.downloadFileThunk} setCurrentDir={props.setCurrentDir} pushToStack={props.pushToStack} file={file} key={i} />)
  // const [musicFiles, setMusicFiles] = useState(musicList);


  // useEffect(() => {
  //   let musicListUpdate = 
  //   setMusicFiles(musicListUpdate)
  // }, [props.musicList]);

  if(props.musicList.length === 0){
    return (
      <div>Загрузите файлы</div>
    )
  }

  return (
    <TransitionGroup
      className={classes.musicList}
    >
      {props.musicList.map((file) => 
        <CSSTransition
          key={file.id}
          timeout={500}
          classNames={'file'}
          exit={false}
        >
          <MusicItem  
            pushToStack={props.pushToStack} 
            deleteFileThunk={props.deleteFileThunk} 
            downloadFileThunk={props.downloadFileThunk} 
            currentDir={props.currentDir} 
            setCurrentDir={props.setCurrentDir} 
            file={file} 
          />
        </CSSTransition>
      )}
    
    </TransitionGroup>
  );
};

export default MusicList;
