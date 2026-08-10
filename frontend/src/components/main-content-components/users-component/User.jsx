import React from "react";
import { NavLink } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 96,
    background: `linear-gradient(135deg, ${theme.palette.primary.light}55, ${theme.palette.grey[200]})`,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const User = ({ user }) => {
  const classes = useStyles();
  const initial = (user.name || user.email || "?").slice(0, 1).toUpperCase();

  return (
    <Card variant="outlined">
      <Box className={classes.media} />
      <CardHeader
        avatar={<Avatar className={classes.avatar}>{initial}</Avatar>}
        title={user.name || "No name"}
        subheader={user.email}
        component={NavLink}
        to={"/profile/" + user._id}
        style={{ color: "inherit", textDecoration: "none" }}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          Circle member. Open the profile to see more details.
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          component={NavLink}
          to={"/profile/" + user._id}
        >
          Profile
        </Button>
        <Button size="small" disabled>
          Follow
        </Button>
      </CardActions>
    </Card>
  );
};

export default User;
