import React from "react";
import classes from "./Paginator.module.css";
import Pagination from "@material-ui/lab/Pagination";

const Paginator = ({
  totalUsersCount,
  pageSize,
  currentPage,
  onPageChenged,
}) => {
  let pagesCount = Math.ceil(totalUsersCount / pageSize);
  let pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }
  return (
    <div className={classes.containerPagination}>
      <Pagination
        count={pages.length}
        variant="outlined"
        shape="rounded"
        defaultPage={currentPage}
        onChange={(e, currentPage) => {
          onPageChenged(currentPage);
        }}
      />
    </div>
  );
};

export default Paginator;
