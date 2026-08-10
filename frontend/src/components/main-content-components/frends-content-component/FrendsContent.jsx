import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
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

const friends = [
  { name: "Tod", status: "online", city: "Moscow" },
  { name: "Olya", status: "active 5 min ago", city: "Saint Petersburg" },
  { name: "Vell", status: "online", city: "Kazan" },
  { name: "Kolya", status: "listening to music", city: "Yekaterinburg" },
  { name: "Loh", status: "offline", city: "Sochi" },
  { name: "Nina", status: "online", city: "Tbilisi" },
];

const FrendsContent = () => {
  const classes = useStyles();

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <Box>
          <Typography variant="overline" color="textSecondary">
            People
          </Typography>
          <Typography variant="h4">Friends</Typography>
          <Typography variant="body2" color="textSecondary">
            Friend list and statuses — demo data
          </Typography>
        </Box>
        <Chip label="6 friends" color="primary" variant="outlined" size="small" />
      </Box>

      <Grid container spacing={2}>
        {friends.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f.name}>
            <Card variant="outlined">
              <CardHeader
                avatar={<Avatar>{f.name.slice(0, 1)}</Avatar>}
                title={f.name}
                subheader={f.status}
              />
              <CardActions>
                <Chip size="small" label={f.city} />
                <Button size="small" color="primary">
                  Message
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FrendsContent;
