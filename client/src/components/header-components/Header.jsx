import React from "react";
import { NavLink } from "react-router-dom";
//----------------------------------
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import {API_URL} from '../../config.js';


import logo from "../../assets/img/logo.svg";
//---------------------------------------
import classes from "./Header.module.css";

const Header = (props) => {

  
  const avatar = props.user.avatar ? `${API_URL + props.user.avatar}` :  "" 


  return (
    <header className={classes.App_header}>
      <img
       className={classes.logo}
        src={logo}
        alt="logo"
      />
      <div className={classes.loginBlock}>
          {props.isAuth ? (
            <div
              className={classes.userInfo}
            >
              <Avatar
                className={classes.userInfoItem}
                src={avatar}
              >
                
              </Avatar>
              <Link
                className={classes.userInfoItem}>
                {props.login}
              </Link>
              <Link 
                className={classes.userInfoItem}
                onClick={props.logout}
              >
                Выйти
              </Link>
            </div>
          ) : (
            <div>
              <NavLink to={"/register"}
              className={classes.loginLink}
              >
                <Link
                  component="button"
                  variant="body2"
                >
                  Регистрация
                </Link>
              </NavLink>

              <NavLink to={"/login"}
                className={classes.loginLink}
              >
                <Link
                  component="button"
                  variant="body2"
                >
                  Войти
                </Link>
              </NavLink>
            </div>
          )}
      </div>
    </header>
  );
};

export default Header;
