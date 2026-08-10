import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Friend = { name: string; ava: string };

type FriendsState = {
  friends: Friend[];
};

const initialState: FriendsState = {
  friends: [
    { name: "Tod", ava: "ava1" },
    { name: "Olya", ava: "ava2" },
    { name: "Vell", ava: "ava3" },
    { name: "Kolya", ava: "ava4" },
    { name: "Loh", ava: "ava5" },
  ],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend(state, action: PayloadAction<Friend>) {
      const exists = state.friends.some(
        (f) => f.name.toLowerCase() === action.payload.name.toLowerCase()
      );
      if (!exists) {
        state.friends.push(action.payload);
      }
    },
  },
});

export const { addFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
