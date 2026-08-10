import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(3),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: theme.spacing(2.5),
    gap: theme.spacing(2),
  },
  composer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.divider}`,
  },
  feed: {
    display: "grid",
    gap: theme.spacing(1.75),
  },
  card: {
    borderRadius: 16,
  },
}));

const feed = [
  {
    id: 1,
    author: "Maria K.",
    initials: "MK",
    time: "12 min",
    text: "Built a calm evening playlist. Anyone else listening to something soft after work?",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: "Ilya R.",
    initials: "IR",
    time: "1 h",
    text: "Uploaded new trip photos. The weather was perfect — almost postcard material.",
    likes: 61,
    comments: 14,
    shares: 11,
  },
  {
    id: 3,
    author: "Circle Team",
    initials: "CT",
    time: "yesterday",
    text: "Welcome to Circle. Feed, friends and messages are here — more features coming soon.",
    likes: 128,
    comments: 42,
    shares: 19,
  },
];

const News = () => {
  const classes = useStyles();

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <Box>
          <Typography variant="overline" color="textSecondary">
            Home
          </Typography>
          <Typography variant="h4">Feed</Typography>
          <Typography variant="body2" color="textSecondary">
            What is new with people in your circle
          </Typography>
        </Box>
        <Chip label="demo posts" color="primary" variant="outlined" size="small" />
      </Box>

      <Paper className={classes.composer} elevation={0}>
        <Typography variant="subtitle1" gutterBottom>
          What is on your mind?
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Post composer will arrive later. For now enjoy the demo feed.
        </Typography>
        <Box display="flex" gridGap={8} style={{ gap: 8 }}>
          <Chip label="Photo" size="small" />
          <Chip label="Music" size="small" />
          <Chip label="Poll" size="small" />
        </Box>
      </Paper>

      <Box className={classes.feed}>
        {feed.map((item) => (
          <Card key={item.id} className={classes.card} variant="outlined">
            <CardHeader
              avatar={<Avatar>{item.initials}</Avatar>}
              title={item.author}
              subheader={item.time}
            />
            <CardContent>
              <Typography variant="body1">{item.text}</Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button size="small" startIcon={<FavoriteBorderIcon />}>
                {item.likes}
              </Button>
              <Button size="small" startIcon={<ChatBubbleOutlineIcon />}>
                {item.comments}
              </Button>
              <Button size="small" startIcon={<ShareOutlinedIcon />}>
                {item.shares}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default News;
