import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "@/lib/api";

type AuthUser = {
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

export const login = createAsyncThunk(
  "auth/login",
  async (form: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(form);
      localStorage.setItem("token", response.data.loginToken);
      return response.data.user as AuthUser;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    form: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(form);
      localStorage.setItem("token", response.data.registerToken);
      return response.data.user as AuthUser;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return null;

    try {
      const response = await authAPI.me();
      localStorage.setItem("token", response.data.token);
      return response.data.user as AuthUser;
    } catch {
      localStorage.removeItem("token");
      return rejectWithValue("Session expired");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      state.currentUser = null;
      state.name = null;
      state.isAuth = false;
      state.authMsg = null;
    },
    clearAuthMessage(state) {
      state.authMsg = null;
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
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isAuth = true;
        state.currentUser = action.payload;
        state.name = action.payload.name || null;
        state.authMsg = action.payload.message || null;
        state.status = "succeeded";
      })
      .addCase(login.rejected, (state, action) => {
        state.authMsg = (action.payload as string) || "Login failed";
        state.status = "failed";
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isAuth = true;
        state.currentUser = action.payload;
        state.name = action.payload.name || null;
        state.authMsg = action.payload.message || null;
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.authMsg = (action.payload as string) || "Registration failed";
        state.status = "failed";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuth = true;
          state.currentUser = action.payload;
          state.name = action.payload.name || null;
        }
        state.status = "succeeded";
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isAuth = false;
        state.currentUser = null;
        state.name = null;
        state.status = "failed";
      });
  },
});

export const { logout, clearAuthMessage, setAuthProfile } = authSlice.actions;
export default authSlice.reducer;
