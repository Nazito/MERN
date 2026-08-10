import { authMeAPI } from "../api/api";
import { stopSubmit } from "redux-form";

const SET_USER_DATA = "SET_USER_DATA";
const SET_REGISTER_DATA = "SET_REGISTER_DATA";
const LOGOUT = "LOGOUT";


//---------------------------- initialState
let initialState = {
  currentUser: "" as object | string,
  id: null as number | null,
  email: null as string | null,
  name: null as string | null,
  isAuth: false as boolean | null,
  authMsg: null as string | null,
};

export type InitialStateType = typeof initialState;

//--------------------------- authReducer
const authReducer = (state = initialState, action: any): InitialStateType => {
  switch (action.type) {
 
    case SET_USER_DATA:
      return {
        ...state,
        currentUser: action.payload,
        isAuth: true,
        name: action.payload.name
      };

    case SET_REGISTER_DATA:
      return {
        ...state,
        authMsg: action.payload 
      };    
      
    case LOGOUT:
      // debugger
      localStorage.removeItem('token')
      return {
        ...state,
        currentUser: "",
        isAuth: false
      };
 
    default:
      return state; 
  }
};

//--------------------------------------------------------------------------
export const setAuthMessage = (text :any) => ({
  type: SET_REGISTER_DATA,
  payload: text,
});
//--------------------------------------------------------------------------

export const setAuthUserData = (user :any) => ({
  type: SET_USER_DATA,
  payload: user,
});

//--------------------------- login (POST) 
export const loginThunk = (form: any) => {
  return async (dispach: any) => {
    try { 
      const response = await authMeAPI.login(form)
      console.log("7887",  response.data)
      dispach(setAuthMessage(response.data.user.message)) 
      dispach(setAuthUserData(response.data.user))
      localStorage.setItem('token', response.data.loginToken)
      // debugger

    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || "Login failed"
      dispach(setAuthMessage(message))
    }
  }
};
//--------------------------- register (POST) 
export const registerThunk = (form : any) => {

  return async (dispach: any) => {
    try { 
      const response = await authMeAPI.register(form)
      dispach(setAuthMessage(response.data.user.message))
      dispach(setAuthUserData(response.data.user))
      localStorage.setItem('token', response.data.registerToken)
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || "Registration failed"
      dispach(setAuthMessage(message))
    }
  }
};
//--------------------------- auth (GET) 
export const getAuthUserData = () => {

  return async (dispach: any) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }

    try { 
      const response = await authMeAPI.authMe()
      dispach(setAuthMessage(response.data.user.message)) 
      dispach(setAuthUserData(response.data.user))
      localStorage.setItem('token', response.data.token)
    } catch (e) {
      localStorage.removeItem('token')
    }
  }
};

//--------------------------- logout (POST)
export const logout = () => ({
  type: LOGOUT,
})
     
export default authReducer;
