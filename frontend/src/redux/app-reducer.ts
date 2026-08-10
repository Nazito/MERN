import { getAuthUserData } from "./auth-reducer";

const INITIALIZED_SUCCES = "INITIALIZED_SUCCES";
//--------------------------------------------------------------------------
export type InitialStateType = {
  initialized: boolean;
};

let initialState: InitialStateType = {
  initialized: false,
};
//--------------------------------------------------------------------------
const appReducer = (state = initialState, action: any): InitialStateType => {
  switch (action.type) {
    case INITIALIZED_SUCCES: {
      return {
        ...state,
        initialized: true,
      };
    }

    default:
      return state;
  }
};
//--------------------------------------------------------------------------
type InitializedSuccesActionType = {
  type: typeof INITIALIZED_SUCCES;
};

export const initializedSucces = (): InitializedSuccesActionType => ({
  type: INITIALIZED_SUCCES,
});
//--------------------------------------------------------------------------
export const initializeApp = () => {
  return async (dispach: any) => {
    await dispach(getAuthUserData())
    dispach(initializedSucces())
  };
};

export default appReducer;
