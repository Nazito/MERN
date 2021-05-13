import React, { useEffect } from "react";
import Profile from "./Profile";
import { connect } from "react-redux";
import {
  getUserProfile,
  // getUserStatus,
  updateStatus,
  savePhoto,
  saveProfile,
  uploadAvatarThunk,
} from "../../../redux/profile-reducer";
import { getAuthUserData } from "../../../redux/auth-reducer";
import { withRouter } from "react-router-dom";
// import { WichAuchRedirect } from "../../../hok/auchRedirect";
import { compose } from "redux";
import PreLoaderComponent from "../../commons/preLoader/PreLoaderComponent";
import { WichAuchRedirect } from "../../../hok/auchRedirect";




import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import classes from "./my-posts-component/profile-info-component/ProfileInfo.module.css";

const ProfileContainer = props => {
  let refreshProfile = () => {
    let userId = props.match.params.userId;  
    if (!userId) {
        userId = props.authoriedUserId;
      if (!userId) {
        props.history.push("login");
      }
    }

    props.getUserProfile(userId);
    // this.props.getUserStatus(userId);
  }

  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  useEffect(()=>{
    if(props.isAuth){
      refreshProfile();
    }
  }, [props.authoriedUserId])

  // componentDidUpdate(prevProps) {
  //   debugger
  //   // if (this.props.match.params.userId !== prevProps.match.params.userId) {}
  //     this.refreshProfile();
    
  // }
  const uploadAvatarHandler777 = (e) =>{
    const file = e.target.files[0]
    props.uploadAvatarThunk(file)

    debugger
  }

  return (
    <>

      <Dialog 
        onClose={handleClose} 
        aria-labelledby="simple-dialog-title" 
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Настройки</DialogTitle>
        <input 
          accept="image/*" 
          className={classes.inputUploadFile} 
          id="icon-button-file" 
          type="file" 
          onChange={e => uploadAvatarHandler777(e)}
        />
        <label 
          htmlFor="icon-button-file"
          className={classes.profileModalBtnBoxed}
        > 
          <Button 
          variant="contained" 
          color="primary" 
          component="span"
          fullWidth={true}
          >
            <ArrowDownwardIcon fontSize="small" />
             Загрузить аватар 777
          </Button>
        </label>

        <label 
          className={classes.profileModalBtnBoxed}
        > 
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth={true}
          >
            <DeleteIcon fontSize="small" />
            Удалить аватар
          </Button>
        </label>
      </Dialog>

      <Profile
        {...props}
        profile={props.profile}
        status={props.status}
        updateStatus={props.updateStatus}
        uploadAvatarThunk={props.uploadAvatarThunk}
      />
       
    </>
  )
  
}

let mapStateToProps = (state) => {
  // debugger
  return {
    profile: state.profilePage.profile,
    status: state.profilePage.status,
    authoriedUserId: state.authReducer.currentUser.userId,
    isAuth: state.authReducer.isAuth, 
  }
};


export default compose(
  connect(mapStateToProps, {
    getAuthUserData,
    getUserProfile,
    // getUserStatus,
    updateStatus,
    saveProfile,
    uploadAvatarThunk
  }),
  withRouter,
  WichAuchRedirect,
)(ProfileContainer);
