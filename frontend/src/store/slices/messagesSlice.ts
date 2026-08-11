import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { messagesAPI } from "@/lib/api";

export type ChatUser = {
  _id: string;
  name?: string;
  avatar?: string;
  bio?: string;
};

export type Conversation = {
  _id: string;
  peer: ChatUser | null;
  lastMessage: string;
  lastMessageAt?: string;
  unreadCount?: number;
};

export type ChatMessage = {
  _id: string;
  text: string;
  senderId: string;
  sender?: ChatUser | null;
  createdAt?: string;
  mine: boolean;
  conversationId?: string;
};

type MessagesState = {
  conversations: Conversation[];
  activeId: string | null;
  messages: ChatMessage[];
  unreadById: Record<string, number>;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  threadStatus: "idle" | "loading" | "succeeded" | "failed";
  sendStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: MessagesState = {
  conversations: [],
  activeId: null,
  messages: [],
  unreadById: {},
  listStatus: "idle",
  threadStatus: "idle",
  sendStatus: "idle",
};

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async () => {
    const { data } = await messagesAPI.conversations();
    return (data.conversations || []) as Conversation[];
  }
);

export const openConversationWithUser = createAsyncThunk(
  "messages/openWithUser",
  async (userId: string) => {
    const { data } = await messagesAPI.openConversation(userId);
    return data.conversation as Conversation;
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string) => {
    const { data } = await messagesAPI.messages(conversationId);
    return {
      conversationId,
      messages: (data.messages || []) as ChatMessage[],
    };
  }
);

export const sendMessage = createAsyncThunk(
  "messages/send",
  async (
    { conversationId, text }: { conversationId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await messagesAPI.send(conversationId, text);
      return {
        conversationId,
        message: data.message as ChatMessage,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err?.response?.data?.message || "Send failed");
    }
  }
);

function clearUnread(state: MessagesState, conversationId: string | null) {
  if (!conversationId) return;
  if (state.unreadById[conversationId]) {
    delete state.unreadById[conversationId];
  }
}

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    resetMessagesState() {
      return initialState;
    },
    setActiveConversation(state, action: PayloadAction<string | null>) {
      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }
      if (!state.unreadById) {
        state.unreadById = {};
      }
      state.activeId = action.payload;
      clearUnread(state, action.payload);
      if (!action.payload) {
        state.messages = [];
      }
    },
    clearConversationUnread(state, action: PayloadAction<string>) {
      if (!state.unreadById) state.unreadById = {};
      clearUnread(state, action.payload);
    },
    receiveMessage(
      state,
      action: PayloadAction<{
        message: ChatMessage;
        conversation?: Conversation;
        /** True only when user is looking at this thread on /message */
        viewing?: boolean;
        /** @deprecated use viewing */
        incrementUnread?: boolean;
      }>
    ) {
      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }
      if (!Array.isArray(state.messages)) {
        state.messages = [];
      }
      if (!state.unreadById) {
        state.unreadById = {};
      }

      const { message, conversation } = action.payload;
      const viewing =
        typeof action.payload.viewing === "boolean"
          ? action.payload.viewing
          : action.payload.incrementUnread === false;
      const conversationId =
        message.conversationId || conversation?._id || "";

      if (conversation) {
        const existingIndex = state.conversations.findIndex(
          (c) => c._id === conversation._id
        );
        if (existingIndex >= 0) {
          state.conversations[existingIndex] = {
            ...state.conversations[existingIndex],
            ...conversation,
          };
        } else {
          state.conversations.unshift(conversation);
        }
        state.conversations.sort((a, b) => {
          const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return tb - ta;
        });
      } else if (conversationId) {
        const idx = state.conversations.findIndex(
          (c) => c._id === conversationId
        );
        if (idx >= 0) {
          state.conversations[idx].lastMessage = message.text;
          state.conversations[idx].lastMessageAt = message.createdAt;
          const [item] = state.conversations.splice(idx, 1);
          state.conversations.unshift(item);
        }
      }

      // Append into open thread only while actually viewing it
      if (viewing && conversationId && conversationId === state.activeId) {
        const exists = state.messages.some((m) => m._id === message._id);
        if (!exists) {
          state.messages.push({ ...message, mine: Boolean(message.mine) });
        }
        clearUnread(state, conversationId);
        return;
      }

      if (conversationId && !message.mine) {
        state.unreadById[conversationId] =
          (state.unreadById[conversationId] || 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        if (!Array.isArray(state.conversations)) {
          Object.assign(state, initialState);
        }
        if (!state.unreadById) state.unreadById = {};
        state.listStatus = "loading";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        if (!Array.isArray(state.conversations)) {
          Object.assign(state, initialState);
        }
        if (!state.unreadById) state.unreadById = {};
        state.listStatus = "succeeded";
        // Preserve client-side unread counts across refetch
        state.conversations = action.payload.map((c) => ({
          ...c,
          unreadCount: state.unreadById[c._id] || 0,
        }));
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.listStatus = "failed";
      })
      .addCase(openConversationWithUser.fulfilled, (state, action) => {
        if (!state.unreadById) state.unreadById = {};
        const conversation = action.payload;
        const idx = state.conversations.findIndex(
          (c) => c._id === conversation._id
        );
        if (idx >= 0) {
          state.conversations[idx] = {
            ...state.conversations[idx],
            ...conversation,
          };
        } else {
          state.conversations.unshift(conversation);
        }
        state.activeId = conversation._id;
        clearUnread(state, conversation._id);
      })
      .addCase(fetchMessages.pending, (state) => {
        state.threadStatus = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        if (!state.unreadById) state.unreadById = {};
        state.threadStatus = "succeeded";
        state.activeId = action.payload.conversationId;
        state.messages = action.payload.messages;
        clearUnread(state, action.payload.conversationId);
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.threadStatus = "failed";
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        const { conversationId, message } = action.payload;
        if (state.activeId === conversationId) {
          const exists = state.messages.some((m) => m._id === message._id);
          if (!exists) {
            state.messages.push({ ...message, mine: true });
          }
        }
        const idx = state.conversations.findIndex(
          (c) => c._id === conversationId
        );
        if (idx >= 0) {
          state.conversations[idx].lastMessage = message.text;
          state.conversations[idx].lastMessageAt = message.createdAt;
          const [item] = state.conversations.splice(idx, 1);
          state.conversations.unshift(item);
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.sendStatus = "failed";
      });
  },
});

export const {
  setActiveConversation,
  receiveMessage,
  resetMessagesState,
  clearConversationUnread,
} = messagesSlice.actions;

export const selectUnreadTotal = (state: { messages: MessagesState }) => {
  const map = state.messages?.unreadById || {};
  return Object.values(map).reduce((sum, n) => sum + (n || 0), 0);
};

export default messagesSlice.reducer;
