import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { registerThunk } from "../../../redux/auth-reducer";

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

const RegisterComponent = (props) => {
  const classes = useStyles();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setAlert(props.authMsg);
  }, [props.authMsg]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = () => {
    props.registerThunk({ ...form });
  };

  return (
    <Box className={classes.root}>
      <Card className={classes.card} variant="outlined">
        {alert && <Alert severity="error">{alert}</Alert>}
        <CardContent>
          <Typography variant="overline" color="textSecondary">
            Join Circle
          </Typography>
          <Typography variant="h5" gutterBottom>
            Sign up
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
          <TextField
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
            className={classes.field}
            onChange={changeHandler}
            name="name"
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button variant="contained" color="primary" onClick={registerHandler}>
            Sign up
          </Button>
          <Link component={NavLink} to="/login" variant="body2">
            Log in
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

export default connect(mapStateToProps, { registerThunk })(RegisterComponent);
