import React, { useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Provider } from "react-redux";
import store from "./redux/redux-store";
import { BrowserRouter, Redirect, Route, withRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme";
import Navbar from "./components/navbar-components/Navbar";
import News from "./components/main-content-components/news-component/News";
import MusicContainer from "./components/main-content-components/music-component/MusicContainer";
import Settings from "./components/main-content-components/settings-component/Settings";
import FrendsContent from "./components/main-content-components/frends-content-component/FrendsContent";
import UsersContainer from "./components/main-content-components/users-component/UsersContainer";
import HeaderContainer from "./components/header-components/HeaderContainer";
import { initializeApp } from "./redux/app-reducer";
import PreLoaderComponent from "./components/commons/preLoader/PreLoaderComponent";
import RegisterComponent from "./components/main-content-components/auth-component/Register";
import LoginComponent from "./components/main-content-components/auth-component/Login";
import "./App.css";
import { getAuthUserData } from "./redux/auth-reducer";
import ProfileContainer from "./components/main-content-components/profile-component/ProfileContainer";
import DialogsContainer from "./components/main-content-components/dialogs-component/DialogsContainer";

const App = ({ initializeApp, initialized, isAuth, store }) => {
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <>
      {!initialized ? (
        <PreLoaderComponent />
      ) : (
        <div className="App-wrapper">
          <HeaderContainer />
          <Navbar store={store} />
          <div className="App-wrapper-content">
            <Route
              exact
              path="/"
              render={() =>
                isAuth ? <Redirect to="/news" /> : <Redirect to="/register" />
              }
            />

            <Route path="/profile/:userId?" component={() => <ProfileContainer />} />
            <Route exact path="/message" component={() => <DialogsContainer />} />
            <Route exact path="/users" component={() => <UsersContainer />} />
            <Route path="/news" component={() => <News />} />
            <Route path="/music" component={() => <MusicContainer />} />
            <Route path="/settings" component={() => <Settings />} />
            <Route path="/frends-content" component={() => <FrendsContent />} />

            {!isAuth && <Route path="/login" component={() => <LoginComponent />} />}
            {!isAuth && <Route path="/register" component={() => <RegisterComponent />} />}
            {isAuth && <Redirect from="/login" to="/news" />}
            {isAuth && <Redirect from="/register" to="/news" />}
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    initialized: state.app.initialized,
    isAuth: state.authReducer.isAuth,
  };
};

let AppContainer = compose(
  withRouter,
  connect(mapStateToProps, { getAuthUserData, initializeApp })
)(App);

const SamurayApp = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Provider store={store}>
          <AppContainer store={store} />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default SamurayApp;
