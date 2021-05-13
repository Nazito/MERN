import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
//------------------ @material-ui
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
//---------------------
import { registerThunk } from "../../../redux/auth-reducer";
//---------------------
import classes from "./Auth.module.css";


const RegisterComponent = (props) => {

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
  // -----------------------------
  const registerHendler = () => { 
    props.registerThunk({...form})
  }  
  // -----------------------------
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
            Регистрация
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
          {/* ------------------- */}
          <TextField 
            id="name" 
            label="Имя" 
            variant="outlined" 
            className={classes.registerFormField}
            onChange={changeHandler}
            name="name"
          />
        </CardContent>
        <CardActions
          className={classes.registerFormActions}
        >
          {/* ------------------- */}
          <Button
            variant="contained"
            color="default"
            onClick={registerHendler}
            // disabled={loading}
          >
            Регистрация
          </Button>
          <NavLink to={"/login"}>
            <Link
              component="button"
              variant="body2"
            >
              Вход
            </Link>
          </NavLink>
        </CardActions>
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  authMsg: state.authReducer.authMsg
  }
};

export default connect(mapStateToProps, { registerThunk })(RegisterComponent); 