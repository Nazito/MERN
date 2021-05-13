import React from "react";
import Paginator from "../../commons/paginator/Paginator";
import User from "./User";
//---------------------
import classesUser from "./Users.module.css";

const Users = ({
  onPageChenged,
  totalUsersCount,
  pageSize,
  currentPage,
  users,
  followingInProgress,
  unfollow,
  follow,
  ...props
}) => {
  


  return (
    <div
      className={classesUser.usersContainer}
    >
      {users.map((u, index) => (
        <User
          user={u}
          key={index}
          followingInProgress={followingInProgress}
          unfollow={unfollow}
          follow={follow}
        />
      ))}
    </div>
  );
};

export default Users;
