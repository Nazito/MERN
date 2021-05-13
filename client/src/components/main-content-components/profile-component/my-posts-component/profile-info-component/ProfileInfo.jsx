import React, { useState } from "react";
import ProfileDataFormReduxForm from "./ProfileDataForm";
import PreLoaderComponent from "../../../../commons/preLoader/PreLoaderComponent";
import ProfileStatusWichHooks from "../profile-status-component/ProfileStatusWichHooks";
//-------------------------------------------
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { Input } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
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


//--------------------------------------------
import profileInfoMainBg from "../../../../../assets/img/profileInfoMainBg.jpg";
import classes from "./ProfileInfo.module.css";

const ProfileInfo = ({
  profile,
  status,
  updateStatus,
  isOwner,
  savePhoto,
  saveProfile,
  uploadAvatarThunk
}) => {

  const uploadAvatarHandler = (e) =>{
    const file = e.target.files[0]
    uploadAvatarThunk(file)

    debugger
  }

  let [editMode, setEditMode] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  if (!profile) {
    return <PreLoaderComponent />;
  }

  const onMainPhotoSelected = (e) => {
    if (e.target.files.length) {
      savePhoto(e.target.files[0]);
    }
  };

  const onSubmit = (formData) => {
    saveProfile(formData).then(() => {
      setEditMode(false);
    });
  };

  return (
    <div
      className={classes.profileInfoWrap}
    >
      <div 
        className={classes.profileInfoBgImg}
      >
        <img src={profileInfoMainBg} />
      </div>

      <Box
        className={classes.profileUserBox}
      >
        <Badge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={
            <IconButton
              onClick={handleClickOpen}
            >
              <SettingsIcon
                className={classes.profileUserSettingsIcon}  
              />
            </IconButton>
          }
        >
          <Avatar 
            alt={profile.name} 
            src="" 
            className={classes.profileUserAva} 
          />
        </Badge>
        <Typography 
          gutterBottom 
          variant="h5"
        >
          {profile.name}
        </Typography>
      </Box>
{/* 
      <div>
        <img src={profile.photos.large ? profile.photos.large : noneUserImg} />
        {isOwner && <Input type={"file"} onChange={onMainPhotoSelected} />}
        {editMode ? (
          <ProfileDataFormReduxForm
            initialValues={profile}
            profile={profile}
            onSubmit={onSubmit}
          />
        ) : (
          <ProfileData
            goToEditMode={() => {
              setEditMode(true);
            }}
            profile={profile}
            isOwner={isOwner}
          />
        )}
        <ProfileStatusWichHooks status={status} updateStatus={updateStatus} />
      </div> */}

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
          onChange={uploadAvatarHandler}
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
             Загрузить аватар
          </Button>
        </label>

        <label 
          className={classes.profileModalBtnBoxed}
        > 
          <Button 
            variant="contained" 
            color="secondary" 
            component="span"
            fullWidth={true}
            onClick={uploadAvatarHandler}
          >
            <DeleteIcon fontSize="small" />
            Удалить аватар
          </Button>
        </label>
      </Dialog>
    </div>
  );
};

const ProfileData = ({ profile, isOwner, goToEditMode }) => {
  return (
    <div>
      {isOwner && (
        <div>
          <button onClick={goToEditMode}>edit</button>
        </div>
      )}

      
      <div>looking for a job: {profile.lookingForAJob ? "yes" : "no"}</div>
      <div>about me: {profile.aboutMe}</div>
      {/* <div>
        contacts:
        {Object.keys(profile.contacts).map((key) => {
          return (
            <Contact
              key={key}
              contactTitle={key}
              contactValue={profile.contacts[key]}
            />
          );
        })}
      </div> */}
    </div>
  );
};

const Contact = ({ contactTitle, contactValue }) => {
  return (
    <div>
      {contactTitle}:::{contactValue}
    </div>
  );
};

export default ProfileInfo;
