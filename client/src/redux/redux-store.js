
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import profileReducer from "./profile-reducer";
import messageReducer from "./message-reducer";
import frendsDataReducer from "./frendsDataReducer";
import usersReducer from "./users-reducer";
import fileReducer from "./files-reducer";
import authReducer from "./auth-reducer";
import thunkMiddleware from "redux-thunk";
import { reducer as formReducer } from "redux-form";
import appReducer from "./app-reducer";
import uploadReducer from "./upload-reducer";


let redusers = combineReducers({
  uploadReducer,
  fileReducer,
  profilePage: profileReducer,
  messagesPage: messageReducer,
  frendsData: frendsDataReducer,
  usersPage: usersReducer,
  authReducer: authReducer,
  app: appReducer,
  form: formReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  redusers,
  /* preloadedState, */ composeEnhancers(applyMiddleware(thunkMiddleware))
);

window.store = store;

export default store;
