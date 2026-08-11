import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "@/lib/api";

export type AuthUser = {
  name?: string;
  userId?: string;
  message?: string;
  avatar?: string;
};

type AuthState = {
  currentUser: AuthUser | null;
  name: string | null;
  isAuth: boolean;
  authMsg: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: AuthState = {
  currentUser: null,
  name: null,
  isAuth: false,
  authMsg: null,
  status: "idle",
};

/** Register only — session is created via NextAuth signIn afterwards */
export const register = createAsyncThunk(
  "auth/register",
  async (
    form: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(form);
      return response.data.user as AuthUser;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateFromSession(state, action: PayloadAction<AuthUser | null>) {
      if (action.payload?.userId) {
        state.isAuth = true;
        state.currentUser = action.payload;
        state.name = action.payload.name || null;
        state.status = "succeeded";
      } else {
        state.isAuth = false;
        state.currentUser = null;
        state.name = null;
        state.status = "succeeded";
      }
    },
    logout(state) {
      state.currentUser = null;
      state.name = null;
      state.isAuth = false;
      state.authMsg = null;
    },
    clearAuthMessage(state) {
      state.authMsg = null;
    },
    setAuthMessage(state, action: PayloadAction<string | null>) {
      state.authMsg = action.payload;
    },
    setAuthProfile(
      state,
      action: PayloadAction<{ name?: string; avatar?: string | null }>
    ) {
      if (action.payload.name) {
        state.name = action.payload.name;
        if (state.currentUser) {
          state.currentUser.name = action.payload.name;
        }
      }
      if ("avatar" in action.payload && state.currentUser) {
        state.currentUser.avatar = action.payload.avatar || undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.rejected, (state, action) => {
        state.authMsg = (action.payload as string) || "Registration failed";
        state.status = "failed";
      })
      .addCase(register.fulfilled, (state) => {
        state.authMsg = null;
        state.status = "succeeded";
      });
  },
});

export const {
  logout,
  clearAuthMessage,
  setAuthMessage,
  setAuthProfile,
  hydrateFromSession,
} = authSlice.actions;
export default authSlice.reducer;
