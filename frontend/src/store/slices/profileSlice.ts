import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { profileAPI } from "@/lib/api";

type Profile = {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
};

type ProfileState = {
  profile: Profile | null;
  posts: Array<{ id: number; message: string; like: number }>;
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: ProfileState = {
  profile: null,
  posts: [
    { id: 1, message: "Hi, how are you?", like: 12 },
    { id: 2, message: "It is my first post", like: 11 },
  ],
  status: "idle",
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    const response = await profileAPI.getProfile(userId);
    return response.data as Profile;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addPost(state, action: PayloadAction<string>) {
      state.posts.push({
        id: Date.now(),
        message: action.payload,
        like: 0,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addPost } = profileSlice.actions;
export default profileSlice.reducer;
