import { usersAPI } from "../api/api";
import { updateObjectInArray } from "../utils/object-helpers";

const FOLLOW = "FOLLOW";
const UN_FOLLOW = "UN_FOLLOW";
const SET_USERS = "SET_USERS";
const SET_CURREN_PAGE = "SET_CURREN_PAGE";
const SET_TOTAL_USERS_COUNT = "SET_TOTAL_USERS_COUNT";
const TOGGLE_IS_FECHING = "TOGGLE_IS_FECHING";
const TOGGLE_IS_FOLLOWING_PROGRES = "TOGGLE_IS_FOLLOWING_PROGRES";

let initialState = {
  users: [],
  pageSize: 1,
  totalUsersCount: 0,
  currentPage: 1,
  isFeching: false,
  followingInProgress: [],
};

const usersReducer = (state = initialState, action) => {
  // debugger
  switch (action.type) {
    case FOLLOW: {
      return {
        ...state,
        users: updateObjectInArray(state.users, action.userId, "id", {
          followed: true,
        }),
      };
    }

    case UN_FOLLOW: {
      return {
        ...state,
        users: updateObjectInArray(state.users, action.userId, "id", {
          followed: false,
        }),
      };
    }
    case SET_USERS: {
      return { ...state, users: action.users };
    }
    case SET_CURREN_PAGE: {
      return { ...state, currentPage: action.currentPage };
    }
    case SET_TOTAL_USERS_COUNT: {
      return { ...state, totalUsersCount: action.count };
    }
    case TOGGLE_IS_FECHING: {
      return { ...state, isFeching: action.isFeching };
    }
    case TOGGLE_IS_FOLLOWING_PROGRES: {
      return {
        ...state,
        followingInProgress: action.isFeching
          ? [...state.followingInProgress, action.userId]
          : state.followingInProgress.filter((id) => id !== action.userId),
      };
    }

    default:
      return state;
  }
};

export const followSucces = (userId) => ({ type: FOLLOW, userId });
export const unfollowSucces = (userId) => ({ type: UN_FOLLOW, userId });
export const setUsers = (users) => {
  // debugger
  return ({ 
    type: SET_USERS, 
    users });
}

export const setCurrenPage = (currentPage) => ({
  type: SET_CURREN_PAGE,
  currentPage,
});
export const setTotalUsersCount = (TotalUsersCount) => ({
  type: SET_TOTAL_USERS_COUNT,
  count: TotalUsersCount,
});
export const setIsFeching = (isFeching) => ({
  type: TOGGLE_IS_FECHING,
  isFeching,
});
export const toggleFollowingProgres = (isFeching, userId) => ({
  type: TOGGLE_IS_FOLLOWING_PROGRES,
  isFeching,
  userId,
});

export const requestUsers = (currentPage, pageSize) => {
  return async (dispach) => {
    dispach(setIsFeching(true));

    let response = await usersAPI.getUsers(currentPage, pageSize);
    console.log("getUsers", response)
    // debugger
    dispach(setIsFeching(false));
    dispach(setUsers(response.users));
    dispach(setTotalUsersCount(response.totalCount));
  };
};

const followUnfollowFlow = async (
  dispach,
  userId,
  apiMethod,
  actionCreatore
) => {
  dispach(toggleFollowingProgres(true, userId));
  let response = await apiMethod(userId);
  if (response.resultCode === 0) {
    dispach(actionCreatore(userId));
  }
  dispach(toggleFollowingProgres(false, userId));
};

export const follow = (userId) => {
  return async (dispach) => {
    followUnfollowFlow(
      dispach,
      userId,
      usersAPI.follow.bind(userId),
      followSucces
    );
  };
};

export const unfollow = (userId) => {
  return async (dispach) => {
    followUnfollowFlow(
      dispach,
      userId,
      usersAPI.unFollow.bind(userId),
      unfollowSucces
    );
  };
};
export default usersReducer;
