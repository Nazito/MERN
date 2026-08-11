import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type AppState = {
  initialized: boolean;
};

const initialState: AppState = {
  initialized: false,
};

/** Bootstrap flag — auth/data load via NextAuth SessionSync */
export const initializeApp = createAsyncThunk("app/initialize", async () => {
  return true;
});

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
