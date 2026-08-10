import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMe } from "./authSlice";
import { fetchFriendRequests } from "./friendsSlice";

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
      await dispatch(fetchFriendRequests());
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
