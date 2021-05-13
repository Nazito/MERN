import profileReducer from "./profile-reducer";
import messageReducer from "./message-reducer";
import frendsDataReducer from "./frendsDataReducer";

let store = {
  _state: {
    profilePage: {
      posts: [
        { id: 1, message: "Hi , how are you", like: 20 },
        { id: 2, message: "Im ok", like: 15 }
      ],
      newPostText: [777]
    },

    messagesPage: {
      dialogs: [
        { name: "Naz", id: 1 },
        { name: "Nick", id: 1 },
        { name: "Bob", id: 1 }
      ],

      messages: [
        { message: "Hi Naz", id: 1 },
        { message: "Hello Nick", id: 1 },
        { message: "Alert Bob", id: 1 }
      ],

      newMessageText: [999]
    },

    frendsData: {
      frends: [
        { name: "Tod", ava: "ava1", id: 1 },
        { name: "Olya", ava: "ava2", id: 1 },
        { name: "Vell", ava: "ava3", id: 1 },
        { name: "Kolya", ava: "ava4", id: 1 },
        { name: "Loh", ava: "ava5", id: 1 }
      ]
    }
  },

  _callSubscriber() {
    console.log("sdsfdsfds");
  },

  getState() {
    return this._state;
  },

  subscribe(observer) {
    this._callSubscriber = observer;
  },

  dispatch(action) {
    this._state.profilePage = profileReducer(this._state.profilePage, action);
    this._state.messagesPage = messageReducer(this._state.messagesPage, action);
    this._state.frendsData = frendsDataReducer(this._state.frendsData, action);

    this._callSubscriber(this.getState());
  }
};

export default store;
window.store = store;
