import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  page: { padding: theme.spacing(3) },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: theme.spacing(2.5),
  },
}));

const settings = [
  { title: "Profile", text: "Name, avatar and short bio" },
  { title: "Privacy", text: "Who can see posts and friend lists" },
  { title: "Notifications", text: "Messages, likes and mentions" },
  { title: "Security", text: "Password and active sessions" },
];

const Settings = () => {
  const classes = useStyles();

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <Box>
          <Typography variant="overline" color="textSecondary">
            Account
          </Typography>
          <Typography variant="h4">Settings</Typography>
          <Typography variant="body2" color="textSecondary">
            Manage account and privacy preferences
          </Typography>
        </Box>
        <Chip label="coming soon" color="primary" variant="outlined" size="small" />
      </Box>

      <Grid container spacing={2}>
        {settings.map((item) => (
          <Grid item xs={12} sm={6} key={item.title}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.text}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>
                  Open later
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Settings;
