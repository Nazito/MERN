import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { postsAPI } from "@/lib/api";

export type PostAuthor = {
  _id: string;
  name?: string;
  avatar?: string;
};

export type Post = {
  _id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  author: PostAuthor | null;
  likesCount: number;
  likedByMe: boolean;
  isMine: boolean;
};

type PostsState = {
  feed: Post[];
  wall: Post[];
  feedStatus: "idle" | "loading" | "succeeded" | "failed";
  wallStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: PostsState = {
  feed: [],
  wall: [],
  feedStatus: "idle",
  wallStatus: "idle",
  createStatus: "idle",
  actionStatus: "idle",
};

function upsertPost(list: Post[], post: Post) {
  const idx = list.findIndex((p) => p._id === post._id);
  if (idx >= 0) {
    list[idx] = post;
  }
}

function removePost(list: Post[], id: string) {
  const idx = list.findIndex((p) => p._id === id);
  if (idx >= 0) list.splice(idx, 1);
}

export const fetchFeed = createAsyncThunk("posts/fetchFeed", async () => {
  const { data } = await postsAPI.feed();
  return (data.posts || []) as Post[];
});

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId: string) => {
    const { data } = await postsAPI.byUser(userId);
    return (data.posts || []) as Post[];
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (text: string, { rejectWithValue }) => {
    try {
      const { data } = await postsAPI.create(text);
      return data.post as Post;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Could not post");
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async (
    { id, text }: { id: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await postsAPI.update(id, text);
      return data.post as Post;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Could not update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await postsAPI.remove(id);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Could not delete post"
      );
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await postsAPI.toggleLike(id);
      return data.post as Post;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err?.response?.data?.message || "Could not like post"
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearWall(state) {
      state.wall = [];
      state.wallStatus = "idle";
    },
    resetPostsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedStatus = "loading";
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.feedStatus = "succeeded";
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.feedStatus = "failed";
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.wallStatus = "loading";
      })
      .addCase(
        fetchUserPosts.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.wallStatus = "succeeded";
          state.wall = action.payload;
        }
      )
      .addCase(fetchUserPosts.rejected, (state) => {
        state.wallStatus = "failed";
      })
      .addCase(createPost.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.createStatus = "succeeded";
        state.feed.unshift(action.payload);
        // Keep own wall in sync if currently showing that author
        if (
          action.payload.author?._id &&
          state.wall.some((p) => p.author?._id === action.payload.author?._id)
        ) {
          const already = state.wall.some((p) => p._id === action.payload._id);
          if (!already) state.wall.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state) => {
        state.createStatus = "failed";
      })
      .addCase(updatePost.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.actionStatus = "succeeded";
        upsertPost(state.feed, action.payload);
        upsertPost(state.wall, action.payload);
      })
      .addCase(updatePost.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(deletePost.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionStatus = "succeeded";
        removePost(state.feed, action.payload);
        removePost(state.wall, action.payload);
      })
      .addCase(deletePost.rejected, (state) => {
        state.actionStatus = "failed";
      })
      .addCase(toggleLike.fulfilled, (state, action: PayloadAction<Post>) => {
        upsertPost(state.feed, action.payload);
        upsertPost(state.wall, action.payload);
      });
  },
});

export const { clearWall, resetPostsState } = postsSlice.actions;
export default postsSlice.reducer;
