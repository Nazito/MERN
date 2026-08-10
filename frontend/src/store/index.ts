import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import appReducer from "./slices/appSlice";
import usersReducer from "./slices/usersSlice";
import messagesReducer from "./slices/messagesSlice";
import friendsReducer from "./slices/friendsSlice";
import profileReducer from "./slices/profileSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      app: appReducer,
      users: usersReducer,
      messages: messagesReducer,
      friends: friendsReducer,
      profile: profileReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
