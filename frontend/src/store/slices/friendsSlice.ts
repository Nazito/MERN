import { createSlice } from "@reduxjs/toolkit";

type Friend = { name: string; ava: string };

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
  reducers: {},
});

export default friendsSlice.reducer;
