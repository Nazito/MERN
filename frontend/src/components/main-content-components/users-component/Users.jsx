import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import User from "./User";

const useStyles = makeStyles((theme) => ({
  page: { padding: theme.spacing(3) },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: theme.spacing(2.5),
  },
}));

const Users = ({ users, followingInProgress, unfollow, follow }) => {
  const classes = useStyles();

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <Box>
          <Typography variant="overline" color="textSecondary">
            Discover
          </Typography>
          <Typography variant="h4">People</Typography>
          <Typography variant="body2" color="textSecondary">
            Find new friends in Circle
          </Typography>
        </Box>
        <Chip
          label={`${(users && users.length) || 0} people`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      <Grid container spacing={2}>
        {(users || []).map((u, index) => (
          <Grid item xs={12} sm={6} md={4} key={u._id || index}>
            <User
              user={u}
              followingInProgress={followingInProgress}
              unfollow={unfollow}
              follow={follow}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Users;
