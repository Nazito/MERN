import React from "react";
import classes from "./Profile.module.css";
import MyPostsContainer from "./my-posts-component/MyPostsContainer";
import ProfileInfo from "./my-posts-component/profile-info-component/ProfileInfo";

const Profile = (props) => {
  return (
    <div 
      className={classes.profileConatiner}
    >
      <ProfileInfo
        profile={props.profile}
        status={props.status}
        updateStatus={props.updateStatus}
        isOwner={props.isOwner}
        savePhoto={props.savePhoto}
        saveProfile={props.saveProfile}
        uploadAvatarThunk={props.uploadAvatarThunk}

      />
      <MyPostsContainer />
    </div>
  );
};

export default Profile;
