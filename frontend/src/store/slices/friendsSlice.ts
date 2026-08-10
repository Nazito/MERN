import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { friendsAPI } from "@/lib/api";

export type FriendUser = {
  _id: string;
  name?: string;
  avatar?: string;
  bio?: string;
  email?: string;
};

export type FriendshipStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "friends"
  | "self";

export type FriendRequest = {
  _id: string;
  from: FriendUser;
  createdAt?: string;
};

type FriendsState = {
  friends: FriendUser[];
  profileFriends: FriendUser[];
  requests: FriendRequest[];
  statusByUserId: Record<string, FriendshipStatus>;
  status: "idle" | "loading" | "succeeded" | "failed";
  requestsStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: FriendsState = {
  friends: [],
  profileFriends: [],
  requests: [],
  statusByUserId: {},
  status: "idle",
  requestsStatus: "idle",
  actionStatus: "idle",
};

export const fetchFriends = createAsyncThunk("friends/fetchMine", async () => {
  const { data } = await friendsAPI.list();
  return (data.friends || []) as FriendUser[];
});

export const fetchFriendsOfUser = createAsyncThunk(
  "friends/fetchOfUser",
  async (userId: string) => {
    const { data } = await friendsAPI.ofUser(userId);
    return (data.friends || []) as FriendUser[];
  }
);

export const fetchFriendRequests = createAsyncThunk(
  "friends/fetchRequests",
  async () => {
    const { data } = await friendsAPI.requests();
    return (data.requests || []) as FriendRequest[];
  }
);

export const fetchFriendshipStatus = createAsyncThunk(
  "friends/fetchStatus",
  async (userId: string) => {
    const { data } = await friendsAPI.status(userId);
    return {
      userId,
      status: data.status as FriendshipStatus,
    };
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friends/sendRequest",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await friendsAPI.sendRequest(userId);
      return {
        userId,
        status: data.status as FriendshipStatus,
        message: data.message as string | undefined,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Request failed");
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/accept",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await friendsAPI.accept(userId);
      return {
        userId,
        status: data.status as FriendshipStatus,
        message: data.message as string | undefined,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Accept failed");
    }
  }
);

export const declineFriendRequest = createAsyncThunk(
  "friends/decline",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await friendsAPI.decline(userId);
      return {
        userId,
        status: data.status as FriendshipStatus,
        message: data.message as string | undefined,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Decline failed");
    }
  }
);

export const removeFriend = createAsyncThunk(
  "friends/remove",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await friendsAPI.remove(userId);
      return {
        userId,
        status: data.status as FriendshipStatus,
        message: data.message as string | undefined,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Remove failed");
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    clearProfileFriends(state) {
      state.profileFriends = [];
    },
    receiveFriendRequest(state, action: PayloadAction<FriendRequest>) {
      const incoming = {
        ...action.payload,
        _id: String(action.payload._id),
        from: {
          ...action.payload.from,
          _id: String(action.payload.from._id),
        },
      };
      const exists = state.requests.some(
        (r) =>
          String(r._id) === incoming._id ||
          String(r.from._id) === incoming.from._id
      );
      if (!exists) {
        state.requests.unshift(incoming);
      }
      state.statusByUserId[incoming.from._id] = "pending_received";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchFriendsOfUser.fulfilled, (state, action) => {
        state.profileFriends = action.payload;
      })
      .addCase(fetchFriendRequests.pending, (state) => {
        state.requestsStatus = "loading";
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.requestsStatus = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state) => {
        state.requestsStatus = "failed";
      })
      .addCase(fetchFriendshipStatus.fulfilled, (state, action) => {
        state.statusByUserId[action.payload.userId] = action.payload.status;
      })
      .addCase(sendFriendRequest.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.statusByUserId[action.payload.userId] = action.payload.status;
      })
      .addCase(sendFriendRequest.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.statusByUserId[action.payload.userId] = action.payload.status;
        state.requests = state.requests.filter(
          (r) => r.from._id !== action.payload.userId
        );
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.statusByUserId[action.payload.userId] = action.payload.status;
        state.requests = state.requests.filter(
          (r) => r.from._id !== action.payload.userId
        );
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.statusByUserId[action.payload.userId] = action.payload.status;
        state.friends = state.friends.filter(
          (f) => f._id !== action.payload.userId
        );
        state.profileFriends = state.profileFriends.filter(
          (f) => f._id !== action.payload.userId
        );
      });
  },
});

export const { clearProfileFriends, receiveFriendRequest } =
  friendsSlice.actions;
export default friendsSlice.reducer;
