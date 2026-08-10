import React, { useEffect } from "react";
import Users from "./Users";
import { connect } from "react-redux";
import {
  unfollow,
  follow,
  setCurrenPage,
  toggleFollowingProgres,
  requestUsers,
} from "../../../redux/users-reducer";
import PreLoaderComponent from "../../commons/preLoader/PreLoaderComponent";
import { compose } from "redux";
import {
  getUsers,
  getPageSize,
  getTotalUsersCount,
  getCurrentPage,
  getIsFeching,
  getFollowingInProgress,
} from "../../../redux/users-selectors";

const UsersContainer = (props) => {


  
 useEffect(() => {
  const { getUsers, currentPage, pageSize } = props;
  getUsers(currentPage, pageSize);
    // debugger
    // console.log("dddd", this.props)
  },[])


  const onPageChenged = (pageNumber) => {
    const { getUsers, pageSize, setCurrenPage } = props;
    getUsers(pageNumber, pageSize);
    setCurrenPage(pageNumber);
  };

  return (
    <>
      {props.isFeching ? <PreLoaderComponent /> : null}
      <Users
        totalUsersCount={props.totalUsersCount}
        pageSize={props.pageSize}
        currentPage={props.currentPage}
        unfollow={props.unfollow}
        follow={props.follow}
        users={props.users}
        onPageChenged={onPageChenged}
        followingInProgress={props.followingInProgress}
      />
    </>
  );
}
/* 
let mapStateToProps = (state) => {
  return {
    users: state.usersPage.users,
    pageSize: state.usersPage.pageSize,
    totalUsersCount: state.usersPage.totalUsersCount,
    currentPage: state.usersPage.currentPage,
    isFeching: state.usersPage.isFeching,
    followingInProgress: state.usersPage.followingInProgress,
  };
};

*/

let mapStateToProps = (state) => {
  return {
    users: getUsers(state),
    pageSize: getPageSize(state),
    totalUsersCount: getTotalUsersCount(state),
    currentPage: getCurrentPage(state),
    isFeching: getIsFeching(state),
    followingInProgress: getFollowingInProgress(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    follow,
    unfollow,
    setCurrenPage,
    toggleFollowingProgres,
    getUsers: requestUsers,
  })
)(UsersContainer);
