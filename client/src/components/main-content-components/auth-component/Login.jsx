import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
// ------------------------------------
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import { loginThunk } from "../../../redux/auth-reducer";
// ------------------------------------
import classes from "./Auth.module.css";


const LoginComponent = (props) => {

  const [form, setForm] = useState({
    email: "", password: ""
  })
  // обработка и вывод ошибок регистрации
  const [alert, setAlert] = useState(null)
  // -----------------------------
  useEffect(() => {
    setAlert(props.authMsg)
  }, [props.authMsg])
  // -----------------------------

  const changeHandler = event =>{
    setForm({...form, [event.target.name] : event.target.value}) 
  }

  const loginHendler = async () => { 
    try{
      props.loginThunk({...form})
    }catch(e){}
  }  
  
  return (
    <div className={classes.registerFormContainer}>
      
      <Card className={classes.registerForm}>
        {alert && <Alert severity="error">{alert}</Alert>}
        <CardContent className={classes.registerFormWrap}>
          <Typography 
            variant="h5" 
            component="h2"
            className={classes.registerFormTitle}
          >
            Вход
          </Typography>
          {/* ------------------- */}
          <TextField 
            id="email" 
            label="Email" 
            variant="outlined"
            className={classes.registerFormField}
            onChange={changeHandler}
            name="email"
          />
          {/* ------------------- */}
          <TextField 
            id="password" 
            label="Пароль" 
            variant="outlined" 
            className={classes.registerFormField}
            onChange={changeHandler}
            name="password"
          />
        </CardContent>

        <CardActions
          className={classes.registerFormActions}
        >
          <Button
            variant="contained"
            color="default"
            onClick={loginHendler}
          >
            Войти
          </Button>
          {/* ------------------- */}
          <NavLink to={"/register"}>
            <Link
              component="button"
              variant="body2"
            >
              Регистрация
            </Link>
          </NavLink>
        </CardActions>
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => {
  // debugger
  return {
    authMsg: state.authReducer.authMsg
  }
};

export default connect(mapStateToProps, { loginThunk })(LoginComponent);