import React, { useEffect } from "react";//, { Suspense } 
import { compose } from "redux";
import { connect } from "react-redux";
import { Provider } from "react-redux";
import store from "./redux/redux-store";
import { BrowserRouter } from "react-router-dom";
import { Route, withRouter } from "react-router-dom";
import Navbar from "./components/navbar-components/Navbar";
import News from "./components/main-content-components/news-component/News";
import MusicContainer from "./components/main-content-components/music-component/MusicContainer";
import Settings from "./components/main-content-components/settings-component/Settings";
import FrendsContent from "./components/main-content-components/frends-content-component/FrendsContent";
import UsersContainer from "./components/main-content-components/users-component/UsersContainer";
import HeaderContainer from "./components/header-components/HeaderContainer";

import { initializeApp } from "./redux/app-reducer";
import PreLoaderComponent from "./components/commons/preLoader/PreLoaderComponent";
// import { lazy } from "react";
import { WichSuspense } from "./hok/wichSuspense";
import RegisterComponent from "./components/main-content-components/auth-component/Register";
import LoginComponent from "./components/main-content-components/auth-component/Login";
import "./App.css";
import { getAuthUserData } from "./redux/auth-reducer";
import ProfileContainer from "./components/main-content-components/profile-component/ProfileContainer";
import DialogsContainer from "./components/main-content-components/dialogs-component/DialogsContainer";
import { Switch } from "@material-ui/core";

// const DialogsContainer = React.lazy(() =>
//   import(
//     "./components/main-content-components/dialogs-component/DialogsContainer"
//   )
// );
// const ProfileContainer = React.lazy(() =>
//   import(
//     "./components/main-content-components/profile-component/ProfileContainer" 
//   )
// );
const App = props =>  {

  useEffect(() => {
    props.initializeApp()
  }, [props.initialized] ) 

  return (
    <>
      {!props.initialized  ? (
      <PreLoaderComponent />
      ) : ( 
      <div
        className="App-wrapper"
      >
        <HeaderContainer />
        <Navbar store={props.store} />
        <div className="App-wrapper-content">
          {/* <Route exact path="/">
            {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
          </Route> */}

          <Route path="/profile/:userId?" component={() => <ProfileContainer/>} />
          <Route exact path="/message" component={() => <DialogsContainer/>}/>
          <Route exact path="/users" component={() => <UsersContainer />} />
          <Route path="/news" component={() => <News />} />
          <Route path="/music" component={() => <MusicContainer />} />
          <Route path="/settings" component={() => <Settings />} />
          <Route path="/frends-content" component={() => <FrendsContent />} />
          
          {!props.isAuth && <Route path="/login" component={() => <LoginComponent />} />}
          {!props.isAuth && <Route path="/register" component={() => <RegisterComponent />} />}
        </div>

      </div>
      )} 
    </>
  );

}

const mapStateToProps = (state) => {
  // debugger
  return {
    initialized: state.app.initialized,
    isAuth: state.authReducer.isAuth
  }
};
let AppContainer = compose(
  withRouter,
  connect(mapStateToProps, {getAuthUserData, initializeApp})
)(App);

const SamurayApp = (props) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppContainer store={store} />
      </Provider>
    </BrowserRouter>
  );
};

export default SamurayApp;
