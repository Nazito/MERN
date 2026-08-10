import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { loginThunk } from "../../../redux/auth-reducer";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: theme.spacing(5, 2),
    background: `radial-gradient(600px 240px at 20% 0%, ${theme.palette.primary.light}33 0%, transparent 60%), linear-gradient(180deg, #f8fbfa 0%, #ffffff 55%)`,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
  },
  field: {
    marginBottom: theme.spacing(1.5),
  },
  actions: {
    justifyContent: "space-between",
    padding: theme.spacing(1, 2, 2),
  },
}));

const LoginComponent = (props) => {
  const classes = useStyles();
  const [form, setForm] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setAlert(props.authMsg);
  }, [props.authMsg]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const loginHandler = async () => {
    try {
      props.loginThunk({ ...form });
    } catch (e) {}
  };

  return (
    <Box className={classes.root}>
      <Card className={classes.card} variant="outlined">
        {alert && <Alert severity="error">{alert}</Alert>}
        <CardContent>
          <Typography variant="overline" color="textSecondary">
            Welcome back
          </Typography>
          <Typography variant="h5" gutterBottom>
            Log in
          </Typography>
          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            className={classes.field}
            onChange={changeHandler}
            name="email"
          />
          <TextField
            fullWidth
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            className={classes.field}
            onChange={changeHandler}
            name="password"
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button variant="contained" color="primary" onClick={loginHandler}>
            Log in
          </Button>
          <Link component={NavLink} to="/register" variant="body2">
            Create account
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    authMsg: state.authReducer.authMsg,
  };
};

export default connect(mapStateToProps, { loginThunk })(LoginComponent);
