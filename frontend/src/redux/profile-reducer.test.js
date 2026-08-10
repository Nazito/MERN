import profileReducer, {
  addPostActionCreator,
  deletePost,
} from "./profile-reducer";

let state = {
  posts: [
    { id: 1, message: "Hi , how are you", like: 20 },
    { id: 2, message: "Im ok", like: 15 },
  ],
};

it("length post should be incremented", () => {
  //1. test data
  let action = addPostActionCreator("teste add Post");
  //2. action
  let newState = profileReducer(state, action);
  //3. expectation
  expect(newState.posts.length).toBe(3);
});

/* 

it("message post should be (teste add Post)", () => {
  //1. test data
  let action = addPostActionCreator("teste add Post");
  //2. action
  let newState = profileReducer(state, action);
  //3. expectation
  expect(newState.posts[2].message).toBe("teste add Post");
});

it("after deleting length of messages should be decrement ", () => {
  //1. test data
  let action = deletePost(1);
  //2. action
  let newState = profileReducer(state, action);
  //3. expectation
  expect(newState.posts.length).toBe(2);
});

it("after deleting length of messages shouldn't be changed if id is incorrect", () => {
  //1. test data
  let action = deletePost(2);
  //2. action
  let newState = profileReducer(state, action);
  //3. expectation
  expect(newState.posts.length).toBe(2);
});
*/
