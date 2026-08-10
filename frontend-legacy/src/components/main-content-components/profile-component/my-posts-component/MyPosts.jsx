import React from "react";
import Post from "./post-component/Post";
import { Field, reduxForm } from "redux-form";
import {
  requiredField,
  maxLengthCreatore,
} from "../../../../utils/validators/validators";
import { Textarea } from "../../../commons/formControls/formsControl";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const maxLength100 = maxLengthCreatore(100);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2.5),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  composer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
  },
  post: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 14,
    padding: theme.spacing(1.75),
    marginBottom: theme.spacing(1.5),
    background: "#fff",
  },
  empty: {
    textAlign: "center",
    padding: theme.spacing(5, 2),
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: 16,
    color: theme.palette.text.secondary,
  },
}));

const MyPosts = React.memo((props) => {
  const classes = useStyles();

  const postItems = [...props.posts].reverse().map((p) => (
    <Box className={classes.post} key={p.id}>
      <Post message={p.message} like={p.like} />
    </Box>
  ));

  const addNewPost = (v) => {
    props.onAddPost(v.newPostText);
  };

  return (
    <Box className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Posts
      </Typography>
      <Paper className={classes.composer} elevation={0} variant="outlined">
        <AddPostFormRedux onSubmit={addNewPost} />
      </Paper>
      {postItems.length ? (
        postItems
      ) : (
        <Paper className={classes.empty} elevation={0}>
          <Typography variant="subtitle1" color="textPrimary">
            No posts yet
          </Typography>
          <Typography variant="body2">Write your first post above</Typography>
        </Paper>
      )}
    </Box>
  );
});

const AddPostForm = (props) => {
  return (
    <form action="" onSubmit={props.handleSubmit}>
      <Field
        component={Textarea}
        name="newPostText"
        placeholder="What is on your mind?"
        validate={[requiredField, maxLength100]}
      />
      <Box mt={1.5}>
        <Button type="submit" variant="contained" color="primary" size="small">
          Publish
        </Button>
      </Box>
    </form>
  );
};

const AddPostFormRedux = reduxForm({ form: "profileAddPostForm" })(AddPostForm);

export default MyPosts;
