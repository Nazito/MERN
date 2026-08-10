import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Dialog = { id: number; name: string };
type Message = { id: number; message: string };

type MessagesState = {
  dialogs: Dialog[];
  messages: Message[];
};

const initialState: MessagesState = {
  dialogs: [
    { name: "Naz", id: 1 },
    { name: "Nick", id: 2 },
    { name: "Bob", id: 3 },
  ],
  messages: [
    { message: "Hi Naz", id: 1 },
    { message: "Hello Nick", id: 2 },
    { message: "Alert Bob", id: 3 },
  ],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        id: Date.now(),
        message: action.payload,
      });
    },
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
