import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersAPI } from "@/lib/api";

export type User = {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
};

type UsersState = {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const data = await usersAPI.getUsers();
  return (data.users || []) as User[];
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load users";
      });
  },
});

export default usersSlice.reducer;
