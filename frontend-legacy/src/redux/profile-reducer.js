import { profileAPI } from "../api/api";
import { stopSubmit } from "redux-form";

const ADD_POST = "ADD-POST";
const DELETE_POST = "DELETE_POST";
const SET_USER_PROFILE = "SET_USER_PROFILE";
const SET_STATUS = "SET_STATUS";
const SAVE_PHOTO_SUCCES = "SAVE_PHOTO_SUCCES";

let initialState = {
  posts: [
    { id: 1, message: "Hi , how are you", like: 20 },
    { id: 2, message: "Im ok", like: 15 },
  ],
  profile: null,
  status: "",
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      let newPost = action.newPostText;
      return {
        ...state,
        posts: [
          ...state.posts,
          {
            id: 3,
            message: newPost,
          },
        ],
        newPostText: "",
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.postId),
      };

    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.profile,
      };

    case SET_STATUS:
      return {
        ...state,
        status: action.status,
      };

    case SAVE_PHOTO_SUCCES:
      return {
        ...state,
        profile: { ...state.profile, photos: action.photos },
      };

    default:
      return state;
  }
};

export const addPostActionCreator = (newPostText) => ({
  type: ADD_POST,
  newPostText: newPostText,
});

export const deletePost = (postId) => ({
  type: DELETE_POST,
  postId,
});

export const setUserProfile = (profile) => ({
  type: SET_USER_PROFILE,
  profile,
});

export const setUserStatus = (status) => ({
  type: SET_STATUS,
  status,
});

export const savePhotoSucces = (photos) => ({
  type: SAVE_PHOTO_SUCCES,
  photos,
});

export const getUserProfile = (userId) => {
  return async (dispach) => {
    try{
      let response = await profileAPI.getProfile(userId);
      dispach(setUserProfile(response.data));

    }catch(e){
      debugger
      alert(e.response.data.message)
    }
  };
};


export const uploadAvatarThunk = (file) => {
  return async (dispach) => {
    try{
     
      const formData = new FormData()
      formData.append('file', file)
      
      let response = await profileAPI.uploadAvatar(formData);
      debugger
      dispach(setUserProfile(response.data));

    }catch(e){
      
      alert(e)
      debugger
    }
  };
};


export const deleteAvatarThunk = () => {
  return async (dispach) => {
    try{
      let response = await profileAPI.deleteAvatar();
      dispach(setUserProfile(response.data));

    }catch(e){
      debugger
      alert(e.response.data.message)
    }
  };
};

// export const getUserStatus = (userId) => {
//   return async (dispach) => {
//     let response = await profileAPI.getStatus(userId);
//     dispach(setUserStatus(response));
//   };
// };

export const updateStatus = (status) => {
  return async (dispach) => {
    let response = await profileAPI.updateStatus(status);
    if (response.data.resultCode === 0) {
      dispach(setUserStatus(status));
    }
  };
};

export const savePhoto = (file) => {
  return async (dispach) => {
    let response = await profileAPI.savePhoto(file);
    if (response.data.resultCode === 0) {
      dispach(savePhotoSucces(response.data.data.photos));
    }
  };
};


export const saveProfile = (profile) => {
  return async (dispach) => {
    let response = await profileAPI.saveProfile(profile);

    if (response.data.resultCode === 0) {
      dispach(getUserProfile(profile.userId));
    } else {
      dispach(
        stopSubmit("edit-profile", { _error: response.data.messages[0] })
      );
      return Promise.reject(response.data.messages[0]);
    }
  };
};

export default profileReducer;
