import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMe } from "./authSlice";
import { fetchFriendRequests } from "./friendsSlice";
import { fetchConversations } from "./messagesSlice";

type AppState = {
  initialized: boolean;
};

const initialState: AppState = {
  initialized: false,
};

export const initializeApp = createAsyncThunk(
  "app/initialize",
  async (_, { dispatch }) => {
    const me = await dispatch(fetchMe());
    if (fetchMe.fulfilled.match(me) && me.payload) {
      await Promise.all([
        dispatch(fetchFriendRequests()),
        dispatch(fetchConversations()),
      ]);
    }
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.initialized = true;
    });
    builder.addCase(initializeApp.rejected, (state) => {
      state.initialized = true;
    });
  },
});

export default appSlice.reducer;
