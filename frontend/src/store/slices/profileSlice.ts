import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { profileAPI } from "@/lib/api";

export type Profile = {
  _id?: string;
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  friendsCount?: number;
};

type ProfileState = {
  profile: Profile | null;
  posts: Array<{ id: number; message: string; like: number }>;
  status: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: ProfileState = {
  profile: null,
  posts: [
    { id: 1, message: "Hi, how are you?", like: 12 },
    { id: 2, message: "It is my first post", like: 11 },
  ],
  status: "idle",
  updateStatus: "idle",
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (userId: string) => {
    const response = await profileAPI.getProfile(userId);
    return response.data as Profile;
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (data: { name?: string; bio?: string }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfile(data);
      return response.data as Profile;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Could not update profile"
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await profileAPI.uploadAvatar(formData);
      return response.data as Profile;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Could not upload avatar"
      );
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  "profile/deleteAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.deleteAvatar();
      return response.data as Profile;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Could not delete avatar"
      );
    }
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
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updateStatus = "failed";
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        state.profile = {
          ...state.profile,
          ...action.payload,
          avatar: action.payload.avatar || undefined,
        };
      });
  },
});

export const { addPost } = profileSlice.actions;
export default profileSlice.reducer;
