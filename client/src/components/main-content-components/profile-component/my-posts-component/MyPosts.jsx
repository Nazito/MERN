import React  from "react"; //,{ memo }
import Post from "./post-component/Post";
import { Field, reduxForm } from "redux-form";
import {
  requiredField,
  maxLengthCreatore,
} from "../../../../utils/validators/validators";
import { Textarea } from "../../../commons/formControls/formsControl";

const maxLength10 = maxLengthCreatore(10);
const MyPosts = React.memo((props) => {
  console.log("44");
  let postItems = [...props.posts].reverse().map((p) => {
    return <Post message={p.message} like={p.like} key={p.id} />;
  });

  let addNewPost = (v) => {
    props.onAddPost(v.newPostText);
  };

  return (
    <div>
      my posts
      <img
        src="http://s1.iconbird.com/ico/2014/1/567/w512h5121389807811officeaddressbookicon.png"
        alt=""
      />
      <AddPostFormRedux onSubmit={addNewPost} />
      {postItems}
    </div>
  );
});

const AddPostForm = (props) => {
  return (
    <form action="" onSubmit={props.handleSubmit}>
      <Field
        component={Textarea}
        name="newPostText"
        placeholder="enter your post"
        validate={[requiredField, maxLength10]}
      />
      <button>SEND</button>
    </form>
  );
};

const AddPostFormRedux = reduxForm({ form: "profileAddPostForm" })(AddPostForm);

export default MyPosts;
