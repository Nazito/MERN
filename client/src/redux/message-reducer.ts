const ADD_MESSAGE = "ADD-MESSAGE";
//---------------------------------------------------

type DialogsType = {
  id: number;
  name: string;
};

type MessagesType = {
  id: number;
  message: string;
};

let initialState = {
  dialogs: [
    { name: "Naz", id: 1 },
    { name: "Nick", id: 1 },
    { name: "Bob", id: 1 },
  ] as Array<DialogsType>,

  messages: [
    { message: "Hi Naz", id: 1 },
    { message: "Hello Nick", id: 1 },
    { message: "Alert Bob", id: 1 },
  ] as Array<MessagesType>,
};
export type InitialStateType = typeof initialState;
//---------------------------------------------------
const messageReducer = (
  state = initialState,
  action: any
): InitialStateType => {
  switch (action.type) {
    case ADD_MESSAGE:
      let newM = action.newMessageText;
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: 10,
            message: newM,
          },
        ],
      };

    default:
      return state;
  }
};
//---------------------------------------------------
type AddMessageAcctionType = {
  type: typeof ADD_MESSAGE;
  newMessageText: string;
};

export const addMessageAC = (
  newMessageText: string
): AddMessageAcctionType => ({
  type: ADD_MESSAGE,
  newMessageText,
});

export default messageReducer;
