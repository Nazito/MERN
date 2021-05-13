import React from "react";
import classes from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import Frends from "./frends-component/Frends";
import Button from "@material-ui/core/Button";

const Navbar = props => {
  return (
    <nav className={classes.App_nav}>
      <NavLink to="/profile" activeClassName={classes.activeLink}>
        <Button 
        variant="contained" 
        className={classes.itemBtn}
        >
          Profile
        </Button>
      </NavLink>
      <NavLink to="/message" activeClassName={classes.activeLink}>
        <Button 
          variant="contained"
          className={classes.itemBtn}
        >
          Messages
        </Button>
      </NavLink>
      <NavLink to="/users" activeClassName={classes.activeLink}>
        <Button 
          variant="contained" 
          className={classes.itemBtn}
        >
          Users
        </Button>
      </NavLink>
      <NavLink to="/news" activeClassName={classes.activeLink}>
        <Button 
          variant="contained" 
          className={classes.itemBtn}
        >
            News
          
        </Button>
      </NavLink>
      <NavLink to="music" activeClassName={classes.activeLink}>
        <Button 
          variant="contained" 
          className={classes.itemBtn}
        >
            Music
        </Button>
      </NavLink>

      <NavLink to="settings" activeClassName={classes.activeLink}>
        <Button 
          variant="contained" 
          className={classes.itemBtn}
        >
            Settings
        </Button>
      </NavLink>

      <div className={classes.frendsItem}>
        <NavLink to="frends-content" className={classes.frendsContainer}>
          <h3>Frends</h3>
          <Frends store={props.store} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
